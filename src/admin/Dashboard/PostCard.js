import React from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { postDel, doLike } from "../../redux/actionCreators/postsActionCreator";

const PostCard = ({ isLoggedIn, userId, post, id }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const postDelete = () => {
    dispatch(postDel(post.postId));
    toast.success("Post deleted successfully!");
  };
  return (
    <div className="card" key={id}>
      <div>
      
          {isLoggedIn && post.post.author === userId ? (
            <div className="buttons_grp">
              <div className="icon">
                <Link
                  to={`admin/dashboard/post/${post.postId}/edit`}
                >
                  <i className="fa fa-pencil"></i>
                </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {postDelete();}}
                  className="icon"
                >
                  <i className="fa fa-trash-o"></i>
                </button>
            </div>
          ) : (
            ""
          )}
        
        <img
          src={post.post.image}
          alt={post.post.title}
          className="card_image"
        />
        <div className="category">
          {post.post.category.split(",").map((ctg, i) => (
            <p className="small bg-dark mb-0 mr-2 py-1 px-2 text-white" key={i}>
              {ctg.trim()}
            </p>
          ))}
        </div>
        <div className="card_content">
          <Link to={`/post/${post.postId}/${post.post.title}`}>
            <h2 className="card_title">{post.post.title}</h2>
          </Link>

          <p className="card_text">
            {post.post.description.substring(0, 1).toUpperCase() +
              post.post.description.substring(1, 100)}
            ...
          </p>
        </div>
      </div>
      <div className="card_footer">
        <div className="author">
          <p>{post.post.postedBy}</p>
        </div>

        <button
          className="heart"
          onClick={(e) => {
            if (!isLoggedIn) {
              history.push("/login");
              toast.warning("Please login to like a post!");
            } else if (
              !(post.post.likes.includes(userId) || post.post.author === userId)
            ) {
              dispatch(doLike(userId, post.postId, post.post));
            }
          }}
        >
          <i class="fa fa-heart"></i>
          {post.post.likes?.length}
        </button>
      </div>

      {/* 
       */}
    </div>
  );
};

export default PostCard;
