import { useState } from "react";
import "./addComment.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createComment } from "../../redux/apiCalls/commentApiCall";

const AddComment = ({ post }) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return toast.error("please write your comment.");
    dispatch(createComment({ text, post }));
    setText("");
  };
  return (
    <form className="add-comment" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-comment-input"
        placeholder="Add comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="add-comment-btn">
        <i className="bi bi-arrow-right-circle"></i>
      </button>
    </form>
  );
};

export default AddComment;
