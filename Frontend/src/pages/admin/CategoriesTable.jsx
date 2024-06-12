import AdminSidebar from "./AdminSidebar";
import "./adminTable.css";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  fetchCategories,
} from "../../redux/apiCalls/categoryApiCall";
const CategoriesTable = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  // Delete User Handler
  const deleteCategoryHandler = (categoryId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteCategory(categoryId));
      }
    });
  };

  return (
    <section className="table-container">
      <AdminSidebar />
      <div className="table-wrapper">
        <h1 className="table-title">categories</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>category title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>
                  <div className="table-button-group">
                    <button>
                      <Link to={`/posts/details/${item._id}`}>View Post</Link>
                    </button>
                    <button onClick={() => deleteCategoryHandler(item._id)}>
                      Delete category
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

export default CategoriesTable;
