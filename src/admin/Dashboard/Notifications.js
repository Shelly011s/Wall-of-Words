import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getNotification } from "../../redux/actionCreators/authActionCreator";
import NotificationCard from "./NotificationCard";
import "../index.css";
import { getPosts } from "../../redux/actionCreators/postsActionCreator";
import PostCard from "./PostCard";

const Notifications = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, allPosts, postsLoading, userId, notif } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      allPosts: state.posts.posts,
      postsLoading: state.posts.postsLoading,
      userId: state.auth.userId,
      notif: state.auth.notifications,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getNotification(userId));
    if (postsLoading) {
      dispatch(getPosts());
    }
  }, [dispatch]);

  const posts = allPosts.filter((post) => notif?.includes(post.postId));
  //console.log(posts);
  return (
    <div className="container-fluid">
      <h2 className= "font-italic ml-5"> New posts from your favourite authors</h2>
      <div className="row border-top ">
        
        {postsLoading ? (
          <h3 className="text-center mt-5 mx-auto">Loading Posts...</h3>
        ) : posts?.length > 0 ? (
          <>
           
              <div className="contain">
                {posts?.map((post, id) => (
                  <NotificationCard
                    isLoggedIn={isLoggedIn}
                    userId={userId}
                    post={post}
                    key={id}
                    id={id}
                  />
                ))}
              </div>
          
          </>
        ) : (
          <h2 className="text-center mt-5 mx-auto" > No new notifications </h2>
        )}
      </div>
    </div>
  );
};

export default Notifications;
