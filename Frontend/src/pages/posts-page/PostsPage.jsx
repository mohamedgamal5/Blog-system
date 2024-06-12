import PostList from "../../components/posts/PostList";

import "./postsPages.css";
import Sidebar from "./../../components/sidebar/Sidebar";
import Pagination from "../../components/pagination/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, getPostCount } from "../../redux/apiCalls/postApiCalls";

const POST_PER_PAGE = 3;
const PostsPage = () => {
  const dispatch = useDispatch();
  const { postsCount, posts } = useSelector((state) => state.post);
  const [currentPage, setCurrentPage] = useState(1);
  const pages = Math.ceil(postsCount / POST_PER_PAGE);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchPosts(currentPage));
  }, [currentPage]);
  useEffect(() => {
    dispatch(getPostCount());
  }, []);
  return (
    <>
      <section className="posts-page">
        <PostList posts={posts} />
        <Sidebar />
      </section>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default PostsPage;
