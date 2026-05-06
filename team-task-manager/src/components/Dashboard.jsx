import { useNavigate } from "react-router-dom";
const Dashboard = () =>{
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
const handlelogic = ()=>{
  localStorage.removeItem("token");
  alert('Logout Successfully');
  //redirect to login page
  navigate("/");
};
const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center flex items-center justify-center">
            <div className="flex flex-row gap-4 w-96 items-center">
      <h1 className="text-black text-4xl text-center font-bold pt-10">Welcome to Dashboard</h1>
  
          <h2 className="text-black text-lg font-semibold">

         Welcome, {user?.name} | {user?.role}

          </h2>
  
   <button onClick={handlelogic} className="px-4 py-2 w-30 border-2 border-solid cursor-pointer bg-black border-white hover:bg-cyan-400 hover:text-black hover:border-black rounded-md text-white font-semibold">
          Logout
        </button>
      </div>
    </div>
  );
}
export default Dashboard;