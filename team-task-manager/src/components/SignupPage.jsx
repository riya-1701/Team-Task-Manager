import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const navigate = useNavigate();
  const handlelogic = async () => {
    if (!name || !email || !password) return alert("Please Enter All Details");
    try {
      // http://localhost:5000/signup
      const response = await fetch("https://team-task-manager-8lzk.onrender.com", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("User Registered Successfully");
        navigate("/");
      } else {
        alert(data.errors?.[0]?.msg || data.message || "SignedIn Fail");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="flex flex-col gap-4 w-96 items-center">
        <h1 className="text-black text-4xl text-center font-bold pt-10">
          Signup
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 w-80 border-black border-3 border-solid rounded-md text-black bg-white"
        ></input>

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

        <div className="flex gap-8 text-black font-bold"> Role:
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="member"
              checked={role === "member"}
              onChange={(e) => setRole(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            Member
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={(e) => setRole(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            Admin
          </label>
        </div>

        <button
          onClick={handlelogic}
          className="px-4 py-2 w-80 border-2 border-solid cursor-pointer bg-black border-white hover:bg-cyan-400 hover:text-black hover:border-black rounded-md text-white font-semibold"
        >
          Signup
        </button>
        <h2 className="text-center font-bold">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-700 cursor-pointer hover:text-cyan-400"
          >
            Login
          </Link>
        </h2>
      </div>
    </div>
  );
};
export default SignupPage;
