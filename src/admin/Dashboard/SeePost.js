import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setFollowers,
  doFollow,
} from "../../redux/actionCreators/authActionCreator";
import {
  doComment,
  doReply,
  getPosts,
  deleteComment,
} from "../../redux/actionCreators/postsActionCreator";
import AddReply from "./AddReply";
import "../index.css";

const SeePost = () => {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const { posts, postsLoading, isLoggedIn, user, userId, followers } =
    useSelector(
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
    console.log("useEffect");
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
    } else {
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
    if (isLoggedIn) {
      await doFollow(author, userId);
    } else {
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
          <div className="col-md-12" style={{ height: "300px" }}>
            <img
              className="h-100 w-100"
              style={{ objectFit: "cover", objectPosition: "center" }}
              src={currentPost.post.image}
              alt={currentPost.post.title}
            />
          </div>
          <div className="col-md-12 p-5 mb-3">
            <div className="d-flex align-items-center justify-content-center flex-wrap">
              <h1 className="display-3 text-capitalize">
                {currentPost.post.title}
              </h1>

              <div className="d-flex col-md-3 align-items-center justify-content-around font-italic">
                <h3> By {currentPost.post.postedBy}</h3>
                <button
                  className="btn btn-primary"
                  onClick={(e) => handleFollow(e, currentPost.post.author)}
                >
                  Follow
                </button>
              </div>
            </div>
            <div className="flex">
              <div className="blog card-text py-5 text-justify">
              <p>
                {currentPost.post.description}
              </p>
              </div>
              <div className="blog py-5 pl-5 d-flex flex-column">
                
                  {!isLoggedIn ? (
                    <form className="w-100" onSubmit={makeComment}>
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
                    <form className="p-3 border rounded mb-2" onSubmit={makeComment}>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          placeholder="Add Comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-primary p-2 my-2"
                        >
                          Add Comment
                        </button>
                      </div>
                    </form>
                  )}
                
                <div>
                  {currentPost.post.comments.length > 0 ? (
                    currentPost.post.comments.map((comment, id) => (
                      <>
                        <form className="block" key={id + 100}>
                          <div className="comment">
                            <div className="user-banner">
                              <div className="user">
                                <div
                                  className="avatar"
                                  style={{
                                    backgroundColor: "#fff5e9",
                                    borderColor: "#ffe0bd",
                                    color: "#F98600",
                                  }}
                                >
                                  {comment.name.split(" ").length < 2
                                    ? comment.name[0] + comment.name[1]
                                    : comment.name.split(" ")[0][0] +
                                      comment.name.split(" ")[1][0]}
                                </div>
                                <h5>{comment.name}</h5>
                              </div>
                            </div>
                            <div className="content">
                              <p>{comment.comment}</p>
                            </div>
                          </div>
                          <div className="form-group px-3">
                            {showReplies[id] === true ? (
                              comment.replies.length > 0 ? (
                                <>
                                  {comment.replies.map((rply, i) => (
                                    <>
                                      <div className="reply comment" key={i}>
                                        <div className="user-banner">
                                          <div className="user">
                                            <div
                                              className="avatar"
                                              style={{
                                                backgroundColor: "#fff5e9",
                                                borderColor: "#ffe0bd",
                                                color: "#F98600",
                                              }}
                                            >
                                              {rply.name.split(" ").length < 2
                                                ? rply.name[0] + rply.name[1]
                                                : rply.name.split(" ")[0][0] +
                                                  rply.name.split(" ")[1][0]}
                                            </div>
                                            <h5>{rply.name}</h5>
                                          </div>
                                          
                                        </div>
                                        <div className="content">
                                          <p>{rply.reply}</p>
                                        </div>
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
                                View {comment.replies.length} replies
                              </button>
                            ) : (
                              ''
                            )}
                          </div>
                          <div className="form-group px-1">
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
                                  toast.success(
                                    "Comment Deleted Successfully!"
                                  );
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
                    <h1 className="card-heading text-center my-3">
                      No comments
                    </h1>
                  )}
                </div>
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
