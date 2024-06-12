import request from "../../utils/request";
import { toast } from "react-toastify";
import { categoryActions } from "../slices/categorySlice";

// Fetch All Categories
export function fetchCategories() {
  return async (dispatch) => {
    try {
      const { data } = await request.get("/api/categories");
      dispatch(categoryActions.setCategories(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// add Category
export function addCategory(newCategory) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post("/api/categories", newCategory, {
        headers: {
          Authorization: getState().auth.user.token,
        },
      });
      dispatch(categoryActions.addCategory(data));
      toast.success("category creared successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// delete Category
export function deleteCategory(categoryId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(`/api/categories/${categoryId}`, {
        headers: {
          Authorization: getState().auth.user.token,
        },
      });
      dispatch(categoryActions.deleteCategory(data.categoryId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
