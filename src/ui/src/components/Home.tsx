import { useEffect, useState } from 'react'

interface HomeProps {
  onLogout: () => void
}

interface UserData {
  id: string
  username: string
  email: string
  roles: string[]
}

const Home = ({ onLogout }: HomeProps) => {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData')
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  return (
    <div className="container">
      <div className="logo-text">Auth Service</div>
      <div className="flex-center">
        <h1>Welcome Back!</h1>
        {userData ? (
          <div className="user-info">
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Roles:</strong> {userData.roles.join(', ')}</p>
          </div>
        ) : (
          <p className="user-info">Loading user data...</p>
        )}
        <button 
          className="btn btn-danger" 
          onClick={onLogout}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Home 