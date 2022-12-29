import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { setFollowers, doFollow } from "../../redux/actionCreators/authActionCreator";
import {
  doComment,
  doReply,
  getPosts,
  deleteComment,
} from "../../redux/actionCreators/postsActionCreator";
import AddReply from "./AddReply";

const SeePost = () => {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const { posts, postsLoading, isLoggedIn, user, userId,followers } = useSelector(
    (state) => ({
      posts: state.posts.posts,
      postsLoading: state.posts.postsLoading,
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user,
      userId: state.auth.userId,
      followers: state.auth.followers,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  const currentPost = posts.find((post) => post.postId === id && post);
  const [replyBox, setReplyBox] = useState([]);
  const [showReplies, setShowReplies] = useState([]);
  useEffect(() => {
    if (postsLoading) {
      dispatch(getPosts());
    }
    console.log("useEffect")
  }, [dispatch]);

  const replyBoxSet = (data, id) => {
    setReplyBox(
      currentPost.post.comments.map((reply, i) => (i === id ? data : false))
    );
  };
  const showRepliesSet = (data, id) => {
    setShowReplies(
      currentPost.post.comments.map((reply, i) => (i === id ? data : false))
    );
  };

  const makeComment = async (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      if (!comment) {
        return toast.warning("Please add comment!");
      }
      if (!name || !comment) {
        return toast.warning("Please fill in all fields!");
      }
      const data = {
        name: user.displayName,
        comment,
        replies: [],
        admin: true,
        userId,
        postOwner: currentPost.post.author === userId,
      };
      setComment("");

      await dispatch(
        doComment(currentPost.postId, currentPost.post.comments, data)
      );
      return toast.success("Comment added Successfully!");
    }
    else{
      history.push("/login");
      toast.warning("Please login to comment!");
    }

    setComment("");
    setName("");
    
  };

  const handleReply = async ({ i, reply }) => {
    let data = {};
    if (isLoggedIn) {
      if (!reply.reply) return toast.warning("Please add Reply!");
      if (!reply.reply || !reply.name)
        return toast.warning("Please fill in all fields!");
      data = {
        name: user.displayName,
        reply: reply.reply,
        admin: true,
        userId,
        postOwner: currentPost.post.author === userId,
      };
    } else {
        history.push("/login");
        toast.warning("Please login to comment!");
    }
  
    const postId = id;
    await dispatch(doReply(i, postId, currentPost.post.comments, data));
    toast.success("Reply added Successfully!");
  };

  const handleFollow = async (e, author) => {
    if(isLoggedIn){
      await doFollow(author,userId);
    }
    else{
      history.push("/login");
      toast.warning("Please login to follow !");
    }
  };

  return (
    <div className="container-fluid">
      {postsLoading ? (
        <h1 className="text-center">Post Loading...</h1>
      ) : currentPost ? (
        <div className="row">
          <div className="col-md-12" style={{ height: "600px" }}>
            <img
              className="h-100 w-100"
              style={{ objectFit: "cover", objectPosition: "top" }}
              src={currentPost.post.image}
              alt={currentPost.post.title}
            />
          </div>
          <div className="col-md-12 p-5 mb-3">
            <div className="d-flex align-items-center justify-content-between">
              <h1 className="display-3 text-capitalize">
                {currentPost.post.title}
              </h1>
              
              <div className="d-flex col-md-3 align-items-center justify-content-around font-italic">
              <h3> By {currentPost.post.postedBy}</h3>
              <button className="btn btn-primary" onClick={(e) => handleFollow(e,currentPost.post.author)}>Follow</button>
              </div>
            </div>
            <div className="d-flex">
              <p className="card-text py-5 w-50 text-justify">
                {currentPost.post.description}
              </p>
              <div className="comments py-5 mt-2 w-50">
                {!isLoggedIn ? (
                  <form className="px-5" onSubmit={makeComment}>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control mr-1"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      
                    </div>
                    <div className="form-group mb-2">
                      <textarea
                        className="form-control"
                        placeholder="Add Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary my-2">
                        Add Comment
                      </button>
                    </div>
                  </form>
                ) : (
                  <form className="px-5" onSubmit={makeComment}>
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        placeholder="Add Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary my-2">
                        Add Comment
                      </button>
                    </div>
                  </form>
                )}
                {currentPost.post.comments.length > 0 ? (
                  currentPost.post.comments.map((comment, id) => (
                    <>
                      <form
                        className="px-3 my-3 mx-5 mb-2 py-3 card"
                        key={id + 100}
                      >
                        <div className="d-flex align-items-center justify-content-between profile">
                          <div className="col-md-6 d-flex">
                            <div className="col-md-3 rounded-circle py-3 text-center bg-dark text-white text-uppercase d-flex align-items-center justify-content-center">
                              {comment.name.split(" ").length < 2
                                ? comment.name[0] + comment.name[1]
                                : comment.name.split(" ")[0][0] +
                                  comment.name.split(" ")[1][0]}
                            </div>
                            <div className="ml-2 mt-1">
                              <h5 className="card-title mb-0 text-capitalize">
                                {comment.name}
                              </h5>
                            </div>
                            <div className="py-3 px-3 mb-0">
                              <p className="card-text">{comment.comment}</p>
                            </div>
                          </div>
                          
                            
                        </div>
                        
                        <p
                          className="text-center my-0 py-2 text-black"
                          style={{ width: "100px" }}
                        >
                        
                        </p>
                        <div className="form-group px-3">
                          {showReplies[id] === true ? (
                            comment.replies.length > 0 ? (
                              <>
                                {comment.replies.map((rply, i) => (
                                  <>
                                    <div
                                      className={`form-group my-2 d-flex align-items-center justify-content-between profile py-3`}
                                      key={i}
                                    >
                                      <div className="col-md-6 d-flex">
                                        <div className="col-md-4 rounded-circle py-3 text-center bg-dark text-blue text-uppercase">
                                          {rply.name.split(" ").length < 2
                                            ? rply.name[0] + rply.name[1]
                                            : rply.name.split(" ")[0][0] +
                                              rply.name.split(" ")[1][0]}
                                        </div>
                                        <div className="ml-2 mt-1">
                                          <h5 className="card-title mb-0 text-capitalize">
                                            {rply.name}
                                          </h5>
                                          
                                        </div>
                                      </div>
                                      {
                                        rply.postOwner ? (
                                          <div className="d-flex col-md-4">
                                            <p className="small bg-dark text-white py-1 px-2 ml-auto">
                                              Owner
                                            </p>                              
                                          </div>
                                        ) : null}
                                    </div>
                                    <div className="col-md-12 pb-5 border-bottom">
                                      {rply.reply}
                                    </div>
                                  </>
                                ))}

                                <button
                                  type="button"
                                  className="btn text-primary"
                                  onClick={() => showRepliesSet(false, id)}
                                >
                                  Hide Replies
                                </button>
                              </>
                            ) : (
                              <p className="card-text">No Replies</p>
                            )
                          ) : comment.replies.length > 0 ? (
                            <button
                              type="button"
                              className="btn text-primary"
                              onClick={() => showRepliesSet(true, id)}
                            >
                              view {comment.replies.length} replies
                            </button>
                          ) : (
                            <p className="card-text">No Replies</p>
                          )}
                        </div>
                        <div className="form-group px-3">
                          {replyBox[id] === true ? (
                            <AddReply
                              id={id}
                              handleReply={handleReply}
                              replyBoxSet={replyBoxSet}
                            />
                          ) : (
                            <button
                              type="button"
                              className="btn text-primary"
                              onClick={() => replyBoxSet(true, id)}
                            >
                              Reply
                            </button>
                          )}
                        </div>
                        {isLoggedIn && currentPost.post.author === userId && (
                          <div className="col-md-12 text-right">
                            <button
                              type="button"
                              className="text-danger btn"
                              onClick={async () => {
                                await dispatch(
                                  deleteComment(
                                    id,
                                    currentPost.postId,
                                    currentPost.post.comments
                                  )
                                );
                                toast.success("Comment Deleted Successfully!");
                              }}
                            >
                              Delete Comment
                            </button>
                          </div>
                        )}
                      </form>
                    </>
                  ))
                ) : (
                  <h1 className="card-heading text-center my-3">No comments</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center">
          Post with id <span className="text-primary">{id}</span> does not
          exists
        </h1>
      )}{" "}
    </div>
  );
};

export default SeePost;
