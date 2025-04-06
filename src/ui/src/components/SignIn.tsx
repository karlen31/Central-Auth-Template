import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import { validateLoginForm } from '../utils/validations'

interface SignInProps {
  setIsAuthenticated: (value: boolean) => void
}

const SignIn = ({ setIsAuthenticated }: SignInProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form using the simplified validation approach
    const validation = validateLoginForm(email, password, recaptchaToken)
    
    if (!validation.isValid) {
      setError(validation.message || 'Please check your input')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        recaptchaToken
      })
      
      if (response.data.success) {
        // Store tokens and user data
        localStorage.setItem('accessToken', response.data.data.accessToken)
        localStorage.setItem('refreshToken', response.data.data.refreshToken)
        // TODO: do not use localStorage for user data
        localStorage.setItem('userData', JSON.stringify(response.data.data.user))
        
        // Update auth state
        setIsAuthenticated(true)
      } else {
        setError(response.data.message || 'Login failed')
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
  }

  return (
    <div className="container">
      <div className="logo-text">Auth Service</div>
      <h1>Sign In</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-group g-recaptcha">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{marginTop: '16px', marginBottom: '16px'}}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-3">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  )
}

export default SignIn 