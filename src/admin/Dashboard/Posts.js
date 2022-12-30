import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPosts } from "../../redux/actionCreators/postsActionCreator";
import PostCard from "./PostCard";

const Posts = () => {
  
  const { isLoggedIn, postsLoading, allPosts, userId } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      postsLoading: state.posts.postsLoading,
      allPosts: state.posts.posts,
      userId: state.auth.userId,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();
  const posts = allPosts.filter((post) => post.post?.author === userId);
  useEffect(() => {
    if (postsLoading) {
      dispatch(getPosts());
    }
  }, [dispatch]);

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center flex-wrap">
        {postsLoading ? (
          <h1 className="text-center">Loading Posts...</h1>
        ) : posts.length > 0 ? (
          <>
          <div className="cards">
            <div className="cards_item">
            {posts.map((post, id) => (
              <PostCard isLoggedIn={isLoggedIn} userId={userId} post={post} key={id} id={id} />
            ))}
            </div>
            </div>
          </>
        ) : (
          <h1 className="text-center">
            You haven't uploaded any post{" "}
            <Link to="/admin/dashboard/addPost" className="ml-2">
              Create Post
            </Link>
          </h1>
        )}
      </div>
    </div>
  );
};

export default Posts;
