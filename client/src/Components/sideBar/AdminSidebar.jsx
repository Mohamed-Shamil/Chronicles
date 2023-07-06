
function AdminSidebar() {
  return (
    <div className="flex flex-col justify-between">

<div className=" w-72 h-screen flex justify-stretch flex-col dark:bg-gray-950 bg-gray-100 shadow-2xl">
<h1 className="text-2xl text-center border-b border-gray-500 dark:border-orange-200 p-2 font-bold dark:text-orange-500"> Chronicles Admin</h1>

<div className="flex-col  flex gap-3 justify-center w-full items-center mt-4">

<div className=" rounded-md h-11 hover:h-14 transition-all duration-500 ease-in-out hover:text-xl w-full flex justify-center items-center hover:bg-gray-800">

<a href="" className="dark:text-white mb-5 font-semibold mt-5  text-gray-900">Dashboard</a>
</div>


<div className=" rounded-md h-11 hover:h-14 transition-all duration-500 ease-in-out hover:text-xl w-full flex justify-center items-center hover:bg-gray-800">

<a href="" className="dark:text-white mb-5 font-semibold mt-5  text-gray-900">Users</a>
</div>


<div className="  rounded-md h-11 hover:h-14 transition-all duration-500 ease-in-out hover:text-xl w-full flex justify-center items-center hover:bg-gray-800">

<a href="" className="dark:text-white mb-5 font-semibold mt-5  text-gray-900">Reports</a>
</div>
</div>


</div>
<div className="mb-1 h-11 p-2 flex justify-center itemts-center hover:h-12 bg-gray-950 transition-all duration-500 ease-in-out hover:text-xl hover:bg-gray-800 border  rounded-sm">
    <a href="" className="text-white"> Logout {`>`}</a>
</div>
    </div>
   
  )
}

export default AdminSidebar
