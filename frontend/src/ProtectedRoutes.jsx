import { Navigate } from "react-router-dom";
import React from 'react'

const ProtectedRoutes = ({children}) => {
  const token = localStorage.getItem("token")

  if(token){
    return children
   }
   else{
    return <Navigate to="/" />
   }
  
}

export default ProtectedRoutes