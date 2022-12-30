import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPosts } from "../../redux/actionCreators/postsActionCreator";
import {
  getFollowers,
  setFollowers,
  getFollowing,
  setFollowing,
} from "../../redux/actionCreators/authActionCreator";
import PostCard from "./PostCard";

const Home = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, allPosts, postsLoading, userId, followers, following } =
    useSelector(
      (state) => ({
        isLoggedIn: state.auth.isLoggedIn,
        allPosts: state.posts.posts,
        postsLoading: state.posts.postsLoading,
        userId: state.auth.userId,
        followers: state.auth.followers,
        following: state.auth.following,
      }),
      shallowEqual
    );

  const posts = allPosts.filter((post) => post.post?.likes?.includes(userId));
  useEffect(() => {
    if (postsLoading) {
      dispatch(getPosts());
    }
  }, [dispatch]);

  useEffect(() => {
    //console.log("useEffect", userId)
    const fetchFollowers = async () => {
      const data = await getFollowers(userId);
      const following = await getFollowing(userId);
      return { data, following };
    };
    fetchFollowers()
      .then((res) => {
        dispatch(setFollowers(res.data));
        dispatch(setFollowing(res.following));
      }) //
      .catch(console.error);
  }, [userId]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          
            <div className="d-flex flew-row border px-3 pt-3 pb-0 mr-5 rounded">
              <p className="m-0">Followers </p>
              <p className="pl-3">{followers?.length}</p>
            </div>
            <div className="d-flex flew-row border px-3 pt-3 pb-0 mr-5 rounded">
            <p>Following </p>
            <p className="pl-3" >{following?.length}</p>
            </div>
          
        </div>
        <h1> Liked Posts </h1>
        {postsLoading ? (
          <h1 className="text-center">Loading Posts...</h1>
        ) : posts.length > 0 ? (
          <>
            <div className="cards">
              <div className="cards_item">
                {posts.map((post, id) => (
                  <PostCard
                    isLoggedIn={isLoggedIn}
                    userId={userId}
                    post={post}
                    key={id}
                    id={id}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Home;
