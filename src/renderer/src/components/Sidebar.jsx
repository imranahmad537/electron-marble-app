import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="bg-white rounded-3xl h-[97vh] w-60 p-4 flex flex-col shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-8">Marble App</h2>
      <ul className="flex flex-col gap-4 text-gray-600 font-medium">
        
        {/* <Link to='/dashboardlayout'  >
       <li className="bg-blue-200 text-blue-800 px-4 py-2 rounded-xl cursor-pointer">Dashboard</li>
       </Link>  */}
       <Link to='stock'>
       <li className="bg-blue-200 text-blue-800 px-4 py-2 rounded-xl cursor-pointer">Stock</li>
       </Link>
        <Link to='/order'>
       <li className="bg-blue-200 text-blue-800 px-4 py-2 rounded-xl cursor-pointer">Order</li>
       </Link>
        <Link to='setting'>
       <li className="bg-blue-200 text-blue-800 px-4 py-2 rounded-xl cursor-pointer">Setting</li>
       </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
