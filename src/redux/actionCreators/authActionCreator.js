import fire from "../../config/fire";
import { toast } from "react-toastify";

export const setFollowers = (data) => ({
  type: "SET_FOLLOWERS",
  payload: data,
  //data is array of followers
});

export const setFollowing = (data) => ({
  type: "SET_FOLLOWING",
  payload: data,
  //data is array of following
});

export const doFollow = async (author, userId) => {
  const followers = await getFollowers(author);
  if (!(followers.includes(author) || followers.includes(userId))) {
    fire
      .firestore()
      .collection("followers")
      .doc(author)
      .set(
        { userId: author, followers: [...followers, userId] },
        { merge: true }
      )
      .then(() => {
        toast.warning("Followers updated");
        //dispatch(setFollowers(userId));
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    toast.warning("Already followed");
    //console.info("Already followed");
  }
};
export const getFollowers = async (author) => {
  const doc = await fire
    .firestore()
    .collection("followers")
    .where("__name__", "==", author)
    .get();
  const followers = [];
  if (!doc.empty) {
    console.log("Document Exist");
    doc.forEach((post) => {
      const list = post.data().followers;
      if (Array.isArray(list)) followers.push(...list);
    });
  } else {
    console.log("Document Doesn't Exist");
  }
  return followers;
};
export const getFollowing = async (author) => {
  const doc = await fire
    .firestore()
    .collection("followers")
    .where("followers", "array-contains", author)
    .get();
  const following = [];
  if (!doc.empty) {
    console.log("Document Exist");
    doc.forEach((post) => {
      //console.log(post.data().userId);
      const list = post.data().userId;
      following.push(list);
    });
  } else {
    console.log("Document Doesn't Exist");
  }
  return following;
};

export const setNotif = (data) => ({
  type: "SET_NOTIFICATIONS",
  payload: data,
  //data is array of post ids
});

export const getNotification = (userId) => async (dispatch) => {
  //read operation
  const doc = await fire
    .firestore()
    .collection("followers")
    .where("userId", "==", userId)
    .get();
  const notif = [];
  if (!doc.empty) {
    doc.forEach((user) => {
      const list = user.data().notifications;
      if (Array.isArray(list)) notif.push(...list);
    });
  } else {
    console.error("Document Doesn't Exist");
  }
  dispatch(setNotif(notif));
};

export const sendNotification = async (author, postId) => {
  //pushing to the notifications array
  const followers = await getFollowers(author);

  followers.forEach(async (follow) => {
    const notif = await getNotification(follow);
    let list = [];
    if (Array.isArray(notif)) {
      list = [...notif, postId];
    } else {
      list.push(postId);
    }
    fire
      .firestore()
      .collection("followers")
      .doc(follow)
      .set({ notifications: list }, { merge: true })
      .then(() => {
        toast.warning("notifications sent successfully");
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

export const removeNotification = (userId, postId, notif) => async (dispatch) => {
  //pop elements
  
  const removed = notif.filter((n) => n !== postId);
  //console.log(removed);
  fire
    .firestore()
    .collection("followers")
    .doc(userId)
    .set({ notifications: removed }, { merge: true })
    .then(() => {
      toast.warning("notification removed");
      dispatch(setNotif(removed));
    })
    .catch((err) => {
      console.error(err);
    });
};
