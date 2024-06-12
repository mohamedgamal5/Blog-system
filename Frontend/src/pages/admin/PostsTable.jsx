import AdminSidebar from "./AdminSidebar";
import "./adminTable.css";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteePost, getAllPosts } from "../../redux/apiCalls/postApiCalls";
import { useSelector } from "react-redux";

const PostsTable = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.post);
  useEffect(() => {
    dispatch(getAllPosts());
  }, []);

  // Delete User Handler
  const deletePostHandler = (postId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this post!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteePost(postId));
      } else {
        swal("Something went wrong!");
      }
    });
  };

  return (
    <section className="table-container">
      <AdminSidebar />
      <div className="table-wrapper">
        <h1 className="table-title">Posts</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>User</th>
              <th>Post title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((item, index) => (
              <tr key={item?._id}>
                <td>{index + 1}</td>
                <td>
                  <div className="table-image">
                    <img
                      src={item?.user?.profilePhoto?.url}
                      alt=""
                      className="table-user-image"
                    />
                    <span className="table-username">
                      {item?.user?.username}
                    </span>
                  </div>
                </td>
                <td>{item.title}</td>
                <td>
                  <div className="table-button-group">
                    <button>
                      <Link to={`/posts/details/${item?._id}`}>View Post</Link>
                    </button>
                    <button onClick={() => deletePostHandler(item?._id)}>
                      Delete post
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PostsTable;
