import "./admin.css";
import Admin from "./Admin";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <Admin />
    </div>
  );
};

export default AdminDashboard;
