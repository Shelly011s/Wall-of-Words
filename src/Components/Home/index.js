import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PostCard from "../../admin/Dashboard/PostCard";
import {
  getPosts,
  setPosts,
  doLike,
} from "../../redux/actionCreators/postsActionCreator";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, postsLoading, isLoggedIn, userId } = useSelector(
    (state) => ({
      posts: state.posts.posts,
      postsLoading: state.posts.postsLoading,
      isLoggedIn: state.auth.isLoggedIn,
      userId: state.auth.userId,
    }),
    shallowEqual
  );
  const [search, setSearch] = useState("");
  const [allPosts, setAllPosts] = useState(() => { if(!postsLoading) return posts;});

  const searchPosts = (e) => {
    e.preventDefault();
    let results = allPosts.filter(
      (p) =>
        p.post.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.post.postedBy?.toLowerCase().includes(search.toLowerCase()) ||
        p.post.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.post.description?.toLowerCase().includes(search.toLowerCase())
    );

    dispatch(setPosts(results));
  };

  const latestPosts = posts;
  latestPosts
    .sort((a, b) => {
      const postA = new Date(a.post.createdAt);
      const postB = new Date(b.post.createdAt);

      if (postA < postB) return 1;
      if (postA > postB) return -1;
      return 0;
    })
    .slice(0, 5);

  useEffect(() => {
    if (postsLoading) {
      dispatch(getPosts());
    }
  }, [dispatch]);

  return (
    
      
        <div className="main">
          <div className="latestPostsHeading border-bottom border-primary mt-5 d-flex justify-content-around">
            <form className=" m-auto w-100 " onSubmit={(e) => searchPosts(e)}>
              <div className="input-group mb-3 w-50">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="input-group-append">
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </form>

            <p className="text-black col-md-3 d-flex align-items-center justify-content-center py-2 h5">
              Latest Posts
            </p>
          </div>
          <div className="cards">
            <div className="cards_item">
              {postsLoading
                ? "Loading posts"
                : latestPosts.map((post, id) => (
                  <PostCard userId={userId} isLoggedIn={isLoggedIn} post={post} key={id} id={id}/>
                  ))}
            </div>
          </div>
        </div>
      
    
  );
};

export default Home;
