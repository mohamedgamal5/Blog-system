import { useState } from "react";
import "./updateComment.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateComment } from "../../redux/apiCalls/commentApiCall";

const UpdateComment = ({ setUpdateComment, commentForUpdate }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState(commentForUpdate.text);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return toast.error("comment is required");
    console.log("C>>", commentForUpdate);
    dispatch(updateComment(commentForUpdate?._id, { text }));
    setUpdateComment(false);
  };
  return (
    <div className="update-comment">
      <form className="update-comment-form" onSubmit={handleSubmit}>
        <abbr title="close">
          <i
            className="bi bi-x-circle-fill update-comment-form-close"
            onClick={() => setUpdateComment(false)}
          ></i>
        </abbr>
        <h1 className="update-comment-title">Update comment</h1>
        <input
          type="text"
          className="update-comment-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="update-comment-btn">
          Update comment
        </button>
      </form>
    </div>
  );
};

export default UpdateComment;
