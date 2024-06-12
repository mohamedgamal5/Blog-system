import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addCategory } from "../../redux/apiCalls/categoryApiCall";

const AddCategory = () => {
  const [title, setTitle] = useState("");

  const dispath = useDispatch();

  // Form Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (title.trim() === "") return toast.error("Category Title is required");
    dispath(addCategory({ title }));
    setTitle("");
  };

  return (
    <div className="add-category">
      <h6 className="add-category-title">Add New Category</h6>
      <form onSubmit={formSubmitHandler}>
        <div className="add-category-form-group">
          <label htmlFor="title">Category Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter Category Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button className="add-category-btn" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
