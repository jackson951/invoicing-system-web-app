import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/sideBar"; // Will create this next
import Topbar from "../components/admin/topBar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet /> {/* Child routes go here */}
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
