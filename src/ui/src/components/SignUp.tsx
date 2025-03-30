import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface SignUpProps {
  setIsAuthenticated: (value: boolean) => void
}

const SignUp = ({ setIsAuthenticated }: SignUpProps) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      // Replace with your actual API endpoint
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      })
      
      if (response.data.success) {
        // Store tokens and user data
        localStorage.setItem('accessToken', response.data.data.accessToken)
        localStorage.setItem('refreshToken', response.data.data.refreshToken)
        localStorage.setItem('userData', JSON.stringify(response.data.data.user))
        
        setSuccess('Account created successfully!')
        
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

  return (
    <div className="container">
      <div className="logo-text">Auth Service</div>
      <h1>Create Account</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
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
            minLength={3}
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
            placeholder="Choose a password"
            required
            minLength={6}
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
        
        <button
          type="submit"
          className="btn"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <Link to="/signin" className="link">
        Already have an account? Sign in here
      </Link>
    </div>
  )
}

export default SignUp 