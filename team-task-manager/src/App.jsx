import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import Projects from './components/Projects';
import TaskBoard from './components/TaskBoard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from "./context/AuthContext";

// function App(){
//     return(
//         <BrowserRouter>
//         <Routes>
//             <Route path="/" element={<LoginPage/>}/>
//             <Route path="/signup" element={<SignupPage/>} />
//             <Route path="/dashboard" element={<Dashboard/>} />
//         </Routes>
//         </BrowserRouter>
//     )
// }
// export default App;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                      element={<Navigate to="/login" />} />
          <Route path="/login"                 element={<LoginPage />} />
          <Route path="/signup"                element={<SignupPage />} />
          <Route path="/dashboard"             element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects"              element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/:projectId"   element={<ProtectedRoute><TaskBoard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
