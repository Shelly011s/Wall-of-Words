import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { removeNotification } from "../../redux/actionCreators/authActionCreator";

const NotificationCard = ({ isLoggedIn, userId, post, id }) => {
  var result = "";
  var d = new Date(post.post.createdAt);
  result += d.toString().substring(4, 15);
  const { notif } = useSelector((state) => ({ notif: state.auth.notifications, }), shallowEqual );

  const dispatch = useDispatch();

  return (
    <div className="notif">
      <img
        className="img-container"
        src={post.post.image}
        alt={post.post.title}
      />

      <div className="notif-content">
        <button
          type="button"
          onClick={() => {
            dispatch(removeNotification(userId, post.postId,notif));
          }}
          className="icon"
        >
          <i className="fa fa-trash-o"></i>
        </button>
        <h4>New Post by {post.post.postedBy}</h4>
        <p>{post.post.title}</p>
        <p className="author">{result}</p>
      </div>
    </div>
  );
};
export default NotificationCard;
