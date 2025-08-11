import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
// import DashboardCard from "./DashboardCard";
import { Users, BarChart2, Folder, Shield, Plus } from "lucide-react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {  
  return (
    <div className="min-h-screen bg-blue-50 p-4 flex gap-2">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="bg-white rounded-3xl p-4 shadow-inner flex-1">
          <Outlet/>
          {/* <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <DashboardCard title="Users" value="1,200" icon={<Users />} />
            <DashboardCard title="Analytics" value="Monthly Report" icon={<BarChart2 />} />
            <DashboardCard title="Projects" value="24 Active" icon={<Folder />} />
            <DashboardCard title="Security" value="Protected" icon={<Shield />} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
