import { SET_USER, RESET_USER, SET_FOLLOWERS,SET_FOLLOWING } from "../actions/authActions";

const initialState = {
  isLoggedIn: false,
  user: null,
  userId: null,
  followers: null,
  following: null
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      state = {
        isLoggedIn: true,
        user: action.payload.providerData[0],
        userId: action.payload.uid,
        followers: []
      };
      return state;
    case RESET_USER:
      state = initialState;
      return state;
    case SET_FOLLOWERS:
        state = { ...state, followers: action.payload };
      return state;
    case SET_FOLLOWING:
        state = { ...state, following: action.payload };
     return state;
    default:
      return state;
  }
}
