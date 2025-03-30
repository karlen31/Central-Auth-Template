import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface SignInProps {
  setIsAuthenticated: (value: boolean) => void
}

const SignIn = ({ setIsAuthenticated }: SignInProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      // Replace with your actual API endpoint
      const response = await axios.post('/api/auth/login', {
        email,
        password
      })
      
      if (response.data.success) {
        // Store tokens and user data
        localStorage.setItem('accessToken', response.data.data.accessToken)
        localStorage.setItem('refreshToken', response.data.data.refreshToken)
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
        
        <button
          type="submit"
          className="btn"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <Link to="/signup" className="link">
        Don't have an account? Sign up here
      </Link>
    </div>
  )
}

export default SignIn 