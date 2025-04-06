import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import { validateRegistrationForm } from '../utils/validations'

interface SignUpProps {
  setIsAuthenticated: (value: boolean) => void
}

const SignUp = ({ setIsAuthenticated }: SignUpProps) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form using the simplified validation approach
    const validation = validateRegistrationForm(
      username,
      email,
      password,
      confirmPassword,
      recaptchaToken
    )
    
    if (!validation.isValid) {
      setError(validation.message || 'Please check your input')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.post('/api/auth/register', {
        username,
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
        setError(response.data.message || 'Registration failed')
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
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
      <h1>Sign Up</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
        </div>
        
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
            placeholder="Create a password"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-3">
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    </div>
  )
}

export default SignUp 