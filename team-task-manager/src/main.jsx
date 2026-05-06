import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import LoginPage from './components/LoginPage'
// import SignupPage from './components/SignupPage'
// import Dashboard from './components/Dashboard'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
    {/* <LoginPage />
    <SignupPage/>
    <Dashboard/> */}
  </StrictMode>,
)
