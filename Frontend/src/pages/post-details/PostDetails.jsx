import "./postDetails.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AddComment from "../../components/comment/AddComment";
import CommentList from "../../components/comment/CommentList";
import swal from "sweetalert";
import UpdatePost from "./UpdatePost";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteePost,
  fetchSinglePost,
  toggleLikePost,
  updatePostImage,
} from "../../redux/apiCalls/postApiCalls";
import { useNavigate } from "react-router-dom";

const PostDetails = () => {
  const dispatch = useDispatch();
  const { post } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);

  const { id } = useParams();

  const [file, setFile] = useState(null);
  const [updatePost, setUpdatePost] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchSinglePost(id));
  }, [id]);

  const updateImageSubmitHandler = (e) => {
    e.preventDefault();
    if (!file) return toast.warning("there is no file!");
    const formData = new FormData();
    formData.append("image", file);
    console.log(formData);
    dispatch(updatePostImage(post?._id, formData));
  };

  const deletePostHandler = (e) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this post!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteePost(post?._id));
        navigate(`/profile/${user?._id}`);
      } else {
        swal("Something went wrong!");
      }
    });
  };

  return (
    <section className="post-details">
      <div className="post-details-image-wrapper">
        <img
          src={file ? URL.createObjectURL(file) : post?.image?.url}
          alt=""
          className="post-details-image"
        />
        {user?._id === post?.user?._id && (
          <form
            onSubmit={updateImageSubmitHandler}
            className="update-post-image-form"
          >
            <label htmlFor="file" className="update-post-label">
              <i className="bi bi-image-fill"></i>
              Select new image
            </label>
            <input
              style={{ display: "none" }}
              type="file"
              name="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button type="submit">upload</button>
          </form>
        )}
      </div>
      <h1 className="post-details-title">{post?.title}</h1>
      <div className="post-details-user-info">
        <img
          src={post?.user?.profilePhoto?.url}
          alt=""
          className="post-details-user-image"
        />
        <div className="post-details-user">
          <strong>
            <Link to={`/profile/${post?.user?._id}`}>
              {post?.user?.username}
            </Link>
          </strong>
          <span>{new Date(post?.createdAt).toDateString()}</span>
        </div>
      </div>
      <p className="post-details-description">{post?.description}</p>
      <div className="post-details-icon-wrapper">
        <div>
          {user && (
            <i
              onClick={() => {
                dispatch(toggleLikePost(post?._id));
              }}
              className={
                post?.likes?.includes(user?._id)
                  ? "bi bi-hand-thumbs-up-fill"
                  : "bi bi-hand-thumbs-up"
              }
            ></i>
          )}
          <small>{post?.likes?.length} likes</small>
        </div>
        {user?._id === post?.user?._id && (
          <div>
            <i
              onClick={() => setUpdatePost(true)}
              className="bi bi-pencil-square"
            ></i>
            <i onClick={deletePostHandler} className="bi bi-trash-fill"></i>
          </div>
        )}
      </div>
      {user ? (
        <AddComment post={post?._id} />
      ) : (
        <p className="post-details-info-write">
          to write a comment you should login first
        </p>
      )}

      <CommentList comments={post?.comments} />
      {updatePost && <UpdatePost post={post} setUpdatePost={setUpdatePost} />}
    </section>
  );
};

export default PostDetails;
