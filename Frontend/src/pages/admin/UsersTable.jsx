import AdminSidebar from "./AdminSidebar";
import "./adminTable.css";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  deleteeProfile,
  getUsersProfile,
} from "../../redux/apiCalls/profileApiCall";
import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";

const UsersTable = () => {
  const dispatch = useDispatch();
  const { isProfileDeleted, loading, profiles } = useSelector(
    (state) => state.profile
  );
  useEffect(() => {
    dispatch(getUsersProfile());
  }, [isProfileDeleted]);

  // Delete User Handler
  const deleteUserHandler = (userId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover profile!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteeProfile(userId));
      }
    });
  };
  if (loading) {
    return (
      <div className="profile-loader">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#00f"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
          secondaryColor="grey"
          strokeWidth={3}
          strokeWidthSecondary={3}
        />
      </div>
    );
  }

  return (
    <section className="table-container">
      <AdminSidebar />
      <div className="table-wrapper">
        <h1 className="table-title">Users</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>User</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((item, index) => {
              return (
                <tr key={item?._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="table-image">
                      <img
                        src={
                          item?.profilePhoto?.url !== "/public/images/user.jpg"
                            ? item?.profilePhoto?.url
                            : "/images/user-avatar.png"
                        }
                        alt=""
                        className="table-user-image"
                      />
                      <span className="table-username">{item?.username}</span>
                    </div>
                  </td>
                  <td>{item?.email}</td>
                  <td>
                    <div className="table-button-group">
                      <button>
                        <Link to={`/profile/${item._id}`}>View Profile</Link>
                      </button>
                      <button onClick={() => deleteUserHandler(item?._id)}>
                        Delete User
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UsersTable;
