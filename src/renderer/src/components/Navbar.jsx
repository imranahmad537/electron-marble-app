import { Bell, LogOut } from "lucide-react";

const Navbar = () => {
  return (
    <div className="bg-white rounded-xl shadow-md flex justify-end items-center px-6 py-4 mb-3">
      <button className="text-gray-600 hover:text-blue-700 mr-4">
        <Bell size={22} />
      </button>
      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1">
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
};

export default Navbar;
