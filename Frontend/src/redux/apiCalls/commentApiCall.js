import request from "../../utils/request";
import { toast } from "react-toastify";
import { postActions } from "../slices/postSlice";
import { commentActions } from "../slices/commentSlice";

// get comment
export function getComments() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get("/api/comments", {
        headers: { Authorization: getState().auth.user.token },
      });
      dispatch(commentActions.setComments(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// create comment
export function createComment(newComment) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post("/api/comments", newComment, {
        headers: { Authorization: getState().auth.user.token },
      });
      dispatch(postActions.addCommentToPost(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// update comment
export function updateComment(commentId, updatedComment) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/api/comments/${commentId}`,
        updatedComment,
        {
          headers: { Authorization: getState().auth.user.token },
        }
      );
      dispatch(postActions.updateCommentPost(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// delete comment
export function deleteComment(commentId) {
  return async (dispatch, getState) => {
    try {
      await request.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: getState().auth.user.token },
      });
      dispatch(postActions.deleteCommentFromPost(commentId));
      dispatch(commentActions.deleteComment(commentId));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
