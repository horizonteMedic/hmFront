import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginPage from './components/Login/Login.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ProtectedRoute from './components/routes/ProtectedRoute.jsx'
import './index.css'

import {createBrowserRouter, RouterProvider} from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>
  },{
    path: "/dashboard",
    element: <ProtectedRoute/>,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
