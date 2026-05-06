import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";

function App(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
        </BrowserRouter>
    )
}
export default App;