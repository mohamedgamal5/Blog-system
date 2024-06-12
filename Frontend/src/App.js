import Header from "./components/header/Header.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/forms/Login";
import Register from "./pages/forms/Register";
import CreatePost from "./pages/create-post/CreatePost";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PostsPage from "./pages/posts-page/PostsPage.jsx";
import Footer from "./components/footer/Footer.jsx";
import PostDetails from "./pages/post-details/PostDetails.jsx";
import { ToastContainer } from "react-toastify";
import Category from "./pages/category/Category.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import Profile from "./pages/profile/Profile.jsx";
import UsersTable from "./pages/admin/UsersTable.jsx";
import PostsTable from "./pages/admin/PostsTable.jsx";
import CategoriesTable from "./pages/admin/CategoriesTable.jsx";
import CommentsTable from "./pages/admin/CommentsTable.jsx";
import FrogotPassword from "./pages/forms/ForgetPassword.jsx";
import ResetPassword from "./pages/forms/ResetPassword.jsx";
import { useSelector } from "react-redux";
import VerifyEmail from "./pages/verified-email/VerifiedEmail.jsx";
function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <ToastContainer theme="colored" position="top-center" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/users/:userId/verify/:token"
          element={!user ? <VerifyEmail /> : <Navigate to="/" />}
        />
        <Route path="/forgot-password" element={<FrogotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile/:id" element={<Profile />} />

        <Route path="posts">
          <Route index element={<PostsPage />} />
          <Route
            path="create-post"
            element={user ? <CreatePost /> : <Navigate to="/login" />}
          />
          <Route path="details/:id" element={<PostDetails />} />
          <Route path="categories/:category" element={<Category />} />
        </Route>

        <Route path="admin-dashboard">
          <Route
            index
            element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
          />
          <Route
            path="users-table"
            element={user?.isAdmin ? <UsersTable /> : <Navigate to="/" />}
          />
          <Route
            path="posts-table"
            element={user?.isAdmin ? <PostsTable /> : <Navigate to="/" />}
          />
          <Route
            path="categories-table"
            element={user?.isAdmin ? <CategoriesTable /> : <Navigate to="/" />}
          />
          <Route
            path="comments-table"
            element={user?.isAdmin ? <CommentsTable /> : <Navigate to="/" />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
