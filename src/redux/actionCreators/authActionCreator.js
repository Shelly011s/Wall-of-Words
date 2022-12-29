import fire from "../../config/fire";

export const setFollowers = (data) => ({
  type: "SET_FOLLOWERS",
  payload: data,
  //data is array of followers
});

export const setFollowing = (data) => ({
  type: "SET_FOLLOWING",
  payload: data,
  //data is array of followers
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
        console.info("followers updated");
        //dispatch(setFollowers(userId));
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    console.info("Already followed");
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
// export const getLikedPosts = async (author) => {
//   const doc = await fire
//     .firestore()
//     .collection("posts")
//     .where("likes", "array-contains", )
//     .get();
//   const posts = [];
//   if (!doc.empty) {
//     console.log("Document Exist");

//     doc.forEach((post) => {
//       //console.log(post.data().userId);
//       const list = post.data().userId;
//       following.push(list);
//     });
//   } else {
//     console.log("Document Doesn't Exist");
//   }
//   return following;
// };
