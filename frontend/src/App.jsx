import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import ProtectedRoute from './ProtectedRoutes'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/register' element={<Register />}/>
      <Route path='/' element={<Login />}/>
      <Route path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App