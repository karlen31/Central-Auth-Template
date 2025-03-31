import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Home from './components/Home'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  
  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated)
    // Check if user is authenticated by looking for access token
    const token = localStorage.getItem('accessToken')
    setIsAuthenticated(!!token)
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userData')
    setIsAuthenticated(false)
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? 
            <Home onLogout={handleLogout} /> : 
            <Navigate to="/signin" />
        } />
        <Route path="/signin" element={
          !isAuthenticated ? 
            <SignIn setIsAuthenticated={setIsAuthenticated} /> : 
            <Navigate to="/" />
        } />
        <Route path="/signup" element={
          !isAuthenticated ? 
            <SignUp setIsAuthenticated={setIsAuthenticated} /> : 
            <Navigate to="/" />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
