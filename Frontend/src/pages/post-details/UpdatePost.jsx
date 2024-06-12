import { useEffect, useState } from "react";
import "./updatePost.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../../redux/apiCalls/postApiCalls";
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";

const UpdatePost = ({ setUpdatePost, post }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [category, setCategory] = useState(post.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return toast.error("post Title is required");
    if (description.trim() === "")
      return toast.error("post description is required");
    if (category.trim() === "") return toast.error("post category is required");
    dispatch(updatePost(post?._id, { title, category, description }));
    setUpdatePost(false);
  };
  useEffect(() => {
    dispatch(fetchCategories());
  }, []);
  return (
    <div className="update-post">
      <form className="update-post-form" onSubmit={handleSubmit}>
        <abbr title="close">
          <i
            className="bi bi-x-circle-fill update-post-form-close"
            onClick={() => setUpdatePost(false)}
          ></i>
        </abbr>
        <h1 className="update-post-title">Update Post</h1>
        <input
          type="text"
          className="update-post-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select className="update-post-input">
          <option disabled value="">
            Select a category
          </option>
          {categories?.map((category) => (
            <option key={category?._id} value={category?.title}>
              {category?.title}
            </option>
          ))}
        </select>
        <textarea
          id=""
          rows="5"
          className="update-post-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit" className="update-post-btn">
          Update post
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
