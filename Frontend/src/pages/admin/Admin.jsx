import { Link } from "react-router-dom";
import AddCategory from "./AddCategory";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";
import { getUsersProfile } from "../../redux/apiCalls/profileApiCall";
import { getPostCount } from "../../redux/apiCalls/postApiCalls";
import { getComments } from "../../redux/apiCalls/commentApiCall";
const Admin = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { profiles } = useSelector((state) => state.profile);
  const { postsCount } = useSelector((state) => state.post);
  const { comments } = useSelector((state) => state.comment);
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getUsersProfile());
    dispatch(getPostCount());
    dispatch(getComments());
  }, []);
  return (
    <div className="amdin-main">
      <div className="admin-main-header">
        <div className="admin-main-card">
          <h5 className="admin-card-title">Users</h5>
          <div className="admin-card-count">{profiles.length}</div>
          <div className="admin-card-link-wrapper">
            <Link to="/admin-dashboard/users-table" className="admn-card-link">
              see all users
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-person"></i>
            </div>
          </div>
        </div>
        <div className="admin-main-card">
          <h5 className="admin-card-title">Posts</h5>
          <div className="admin-card-count">{postsCount}</div>
          <div className="admin-card-link-wrapper">
            <Link to="/admin-dashboard/posts-table" className="admn-card-link">
              see all posts
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-file-post"></i>
            </div>
          </div>
        </div>
        <div className="admin-main-card">
          <h5 className="admin-card-title">Categories</h5>
          <div className="admin-card-count">{categories.length}</div>
          <div className="admin-card-link-wrapper">
            <Link
              to="/admin-dashboard/categories-table"
              className="admn-card-link"
            >
              see all categories
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-tag-fill"></i>
            </div>
          </div>
        </div>
        <div className="admin-main-card">
          <h5 className="admin-card-title">Comments</h5>
          <div className="admin-card-count">{comments.length}</div>
          <div className="admin-card-link-wrapper">
            <Link
              to="/admin-dashboard/comments-table"
              className="admn-card-link"
            >
              see all comments
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-chat-left-text"></i>
            </div>
          </div>
        </div>
      </div>
      <AddCategory />
    </div>
  );
};

export default Admin;
