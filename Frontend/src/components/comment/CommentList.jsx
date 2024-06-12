import { useState } from "react";
import "./commentList.css";
import swal from "sweetalert";
import UpdateComment from "./UpdateComment";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../../redux/apiCalls/commentApiCall";

const CommentList = ({ comments }) => {
  const dispatch = useDispatch();
  const [updateComment, setUpdateComment] = useState(false);
  const [commentForUpdate, setCommentForUpdate] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const updateCommentHandler = (comment) => {
    setCommentForUpdate(comment);
    setUpdateComment(true);
  };

  const deleteCommentHandler = (commentId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this comment!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteComment(commentId));
      }
    });
  };
  return (
    <div className="comment-list">
      <h4 className="comment-list-count">{comments?.length}comments</h4>
      {comments?.map((comment) => (
        <div key={comment._id} className="comment-item">
          <div className="comment-item-info">
            <div className="comment-item-username">{comment.username}</div>
            <div className="comment-item-time">
              <Moment fromNow ago>
                {comment.createdAt}
              </Moment>{" "}
              ago
            </div>
          </div>
          <p className="comment-item-text">{comment?.text}</p>
          {user?._id === comment?.user && (
            <div className="comment-item-icon-wrapper">
              <i
                className="bi bi-pencil-square"
                onClick={() => updateCommentHandler(comment)}
              ></i>
              <i
                className="bi bi-trash-fill"
                onClick={() => deleteCommentHandler(comment?._id)}
              ></i>
            </div>
          )}
        </div>
      ))}
      {updateComment && (
        <UpdateComment
          commentForUpdate={commentForUpdate}
          setUpdateComment={setUpdateComment}
        />
      )}
    </div>
  );
};

export default CommentList;
