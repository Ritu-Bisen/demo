"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminAssignTask from "./pages/admin/AssignTask"
// import AllTasks from "./pages/admin/AllTasks"
import DataPage from "./pages/admin/DataPage"
import AdminDataPage from "./pages/admin/admin-data-page"
import AccountDataPage from "./pages/delegation"
import QuickTask from "./pages/QuickTask" 
import AdminDelegationTask from "./pages/delegation-data"
import "./index.css"
import Demo from "./pages/user/Demo"
import Setting from "./pages/Setting"

// Auth wrapper component to protect routes
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const username = localStorage.getItem("user-name")
  const userRole = localStorage.getItem("role")

  // If no user is logged in, redirect to login
  if (!username) {
    return <Navigate to="/login" replace />
  }

  // If this is an admin-only route and user is not admin, redirect to tasks
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard/admin" replace />
  }

  return children
}

function App() {
  // const [darkMode, setDarkMode] = useState(false)

  // useEffect(() => {
  //   // Check for user preference
  //   if (
  //     localStorage.theme === "dark" ||
  //     (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  //   ) {
  //     setDarkMode(true)
  //     document.documentElement.classList.add("dark")
  //   } else {
  //     setDarkMode(false)
  //     document.documentElement.classList.remove("dark")
  //   }
  // }, [])

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode)
  //   if (darkMode) {
  //     document.documentElement.classList.remove("dark")
  //     localStorage.theme = "light"
  //   } else {
  //     document.documentElement.classList.add("dark")
  //     localStorage.theme = "dark"
  //   }
  // }

  return (
    <Router>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/demo" element={<Demo/>}/>

        {/* Dashboard redirect */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/admin" replace />} />

        {/* Admin & User Dashboard route */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/quick-task"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <QuickTask />
            </ProtectedRoute>
          }
        />


        {/* Assign Task route - only for admin */}
        <Route
          path="/dashboard/assign-task"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAssignTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/delegation-task"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDelegationTask/>
            </ProtectedRoute>
          }
        />

         {/* Delegation route for user */}
          <Route
          path="/dashboard/delegation"
          element={
            <ProtectedRoute>
              <AccountDataPage/>
            </ProtectedRoute>
          }
        />

             <Route
          path="/dashboard/setting"
          element={
            <ProtectedRoute>
              <Setting/>
            </ProtectedRoute>
          }
        />

        {/* Data routes */}
        <Route
          path="/dashboard/data/:category"
          element={
            <ProtectedRoute>
              <DataPage />
            </ProtectedRoute>
          }
        />

        {/* Specific route for Admin Data Page */}
        <Route
          path="/dashboard/data/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDataPage />
            </ProtectedRoute>
          }
        />

        {/* Backward compatibility redirects */}
        <Route path="/admin/*" element={<Navigate to="/dashboard/admin" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/dashboard/admin" replace />} />
        <Route path="/admin/quick" element={<Navigate to="/dashboard/quick-task" replace />} />
        <Route path="/admin/assign-task" element={<Navigate to="/dashboard/assign-task" replace />} />
        <Route path="/admin/delegation-task" element={<Navigate to="/dashboard/delegation-task" replace />} />
        <Route path="/admin/data/:category" element={<Navigate to="/dashboard/data/:category" replace />} />
        <Route path="/user/*" element={<Navigate to="/dashboard/admin" replace />} />
      </Routes>
    </Router>
  )
}

export default App