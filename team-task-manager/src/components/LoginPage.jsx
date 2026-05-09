import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();
  const handlelogic = async()=>{
          if(!email || !password) return alert("Please Enter Email & Password!");
          try{

              const response = await fetch("https://team-task-manager-8lzk.onrender.com/login",{
                  method: "POST",
                  headers:{
                      "Content-type": "application/json",
                  },
                  body: JSON.stringify({email, password})
              });
              const data = await response.json();
              console.log(data);

              if(response.ok){


                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                navigate("/dashboard")
              }else{
                alert(data.message || "Login Unsuccessful")
              }
          } catch(error){
          console.error(error);
          alert("Server Error");
      }
      }

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="flex flex-col gap-4 w-96 items-center rounded-md">
        <h1 className="text-black text-4xl text-center font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 w-80 border-black border-3 border-solid rounded-md text-black bg-white"
        ></input>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="px-4 py-2 w-80 border-black border-3 border-solid rounded-md text-black bg-white"
        ></input>

        <button onClick={handlelogic} className="px-4 py-2 w-80 border-2 border-solid cursor-pointer bg-black border-white hover:bg-cyan-400 hover:text-black hover:border-black rounded-md text-white font-semibold">
          Login
        </button>
        <h2 className="text-center font-bold">Don't have an account? <Link to="/signup" className="text-blue-700 cursor-pointer hover:text-cyan-400">Signup</Link></h2>
      </div>
    </div>
  );
};
export default LoginPage;
