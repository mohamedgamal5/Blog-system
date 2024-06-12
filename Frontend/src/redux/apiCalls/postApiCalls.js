import request from "../../utils/request";
import { toast } from "react-toastify";
import { postActions } from "../slices/postSlice";

//fetch post based on page no.
export function fetchPosts(pageNo) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts?pageNumber=${pageNo}`);
      dispatch(postActions.setPosts(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//fetch post count.
export function getPostCount() {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts/count`);
      dispatch(postActions.setPostsCount(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//get all post.
export function getAllPosts() {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts`);
      dispatch(postActions.setPosts(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//fetch post based on category.
export function fetchPostsByCategory(category) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts?category=${category}`);
      dispatch(postActions.setPostsCate(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//create post
export function createPost(newPost) {
  return async (dispatch, getState) => {
    try {
      dispatch(postActions.setLoading());
      await request.post(`/api/posts`, newPost, {
        headers: {
          Authorization: getState().auth.user.token,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(postActions.setIsPostcreated());
      setTimeout(() => dispatch(postActions.clearIsPostcreated()), 3000);
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(postActions.clearLoading());
    }
  };
}

//get post
export function fetchSinglePost(postId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts/${postId}`);
      dispatch(postActions.setPost(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//toggle like post
export function toggleLikePost(postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/api/posts/like/${postId}`,
        {},
        {
          headers: {
            Authorization: getState().auth.user.token,
          },
        }
      );
      dispatch(postActions.setLike(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//update post image
export function updatePostImage(postId, newImage) {
  return async (dispatch, getState) => {
    try {
      await request.put(`/api/posts/update-image/${postId}`, newImage, {
        headers: {
          Authorization: getState().auth.user.token,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("new image uploaded successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//update post image
export function updatePost(postId, updatedPost) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(`/api/posts/${postId}`, updatedPost, {
        headers: {
          Authorization: getState().auth.user.token,
        },
      });
      dispatch(postActions.setPost(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//delete post
export function deleteePost(postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: getState().auth.user.token,
        },
      });
      dispatch(postActions.deletePost(data.postId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
