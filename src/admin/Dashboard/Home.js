import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPosts } from "../../redux/actionCreators/postsActionCreator";
import {
  getFollowers,
  setFollowers,
  getFollowing,
  setFollowing
} from "../../redux/actionCreators/authActionCreator";
import PostCard from "./PostCard";

const Home = () => {
  const dispatch = useDispatch();
  const { allPosts,postsLoading, userId, followers,following } = useSelector(
    (state) => ({
      allPosts: state.posts.posts,
      postsLoading: state.posts.postsLoading,
      userId: state.auth.userId,
      followers: state.auth.followers,
      following: state.auth.following
    }),
    shallowEqual
  );
  
  const posts = allPosts.filter((post) => post.post?.likes.includes(userId));
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
        <div className="col-md-12">
          
          <div className="container justify-content-center">
            <div className="container">
            <p>Followers </p>
            <h1>{followers?.length}</h1>
            <p>Following </p>
            <h1>{following?.length}</h1>
            </div>
            
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
              <PostCard post={post} key={id} id={id} />
            ))}
            </div>
            </div>
          </>
        ) : ('')}
      </div>
    </div>
  );
};

export default Home;
