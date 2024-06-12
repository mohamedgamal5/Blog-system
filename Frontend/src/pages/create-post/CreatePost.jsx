import { useEffect, useState } from "react";
import "./createPost.css";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/apiCalls/postApiCalls";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";
const CreatePost = () => {
  const dispatch = useDispatch();
  const { loading, isPostCreated } = useSelector((state) => state.post);
  const { categories } = useSelector((state) => state.category);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return toast.error("post Title is required");
    if (description.trim() === "")
      return toast.error("post description is required");
    if (category.trim() === "") return toast.error("post category is required");
    if (!file) return toast.error("post image is required");
    console.log("111111", file);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", file);
    dispatch(createPost(formData));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isPostCreated) {
      navigate("/");
    }
  }, [isPostCreated, navigate]);
  useEffect(() => {
    dispatch(fetchCategories());
  }, []);
  return (
    <section className="create-post">
      <h1 className="create-post-title"> Create new post</h1>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          className="create-post-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="create-post-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option disabled value="">
            Select A Category
          </option>
          {categories?.map((category) => (
            <option key={category?._id} value={category?.title}>
              {category?.title}
            </option>
          ))}
        </select>
        <textarea
          className="create-post-textarea"
          placeholder="Post Description"
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="file"
          name="file"
          id="file"
          className="create-post-upload"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="create-post-btn" type="submit">
          {loading ? (
            <RotatingLines
              visible={true}
              height="96"
              width="96"
              color="blue"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            "Create"
          )}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
