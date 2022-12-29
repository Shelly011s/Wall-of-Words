import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Admin from "./admin";
import Home from "./Components/Home";
import Login from "./admin/Login";
import Register from "./admin/Register";
import "./App.css";
import Navbar from "./Components/Navbar/index";
import fire from "./config/fire";
import SeePost from "./admin/Dashboard/SeePost";
import Offline from "./Components/Offline";

const App = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const history = useHistory();
  let { path } = useRouteMatch();
  //console.log(path, pathname)
  useEffect(() => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        if (!isLoggedIn) {dispatch({ type: "SET_USER", payload: user });}
      }
    });
  }, [dispatch]);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [onLine, setOnLine] = useState(false);

  useEffect(() => {
    setOnLine(navigator.onLine);
    if (!onLine) dispatch({ type: "RESET_USER" });
  }, [navigator.onLine]);

  if (!onLine) {
    return <Offline />;
  }

  // login user
  const loginUser = (email, password) => {
    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        dispatch({ type: "SET_USER", payload: user });
        toast.success("Successfully Logged In");
        history.push("/admin/dashboard");
      })
      .catch((err) => {
        if (err.code === "auth/user-not-found") {
          return toast.error("Invalid Email or Password");
        }
        if (err.code === "auth/invalid-email") {
          return toast.error("Please enter valid email");
        }
      });
  };

  // register user
  const registerUser = ({ name, email, password, confirmPassword }) => {
    if (!name || !email || !password || !confirmPassword) {
      return toast.warning("Please fill in all fields!!");
    }

    if (password !== confirmPassword) {
      return toast.warning("Passwords donot match!");
    }

    fire
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const currentUser = fire.auth().currentUser;
        currentUser.updateProfile({
          displayName: name,
        });
       
        dispatch({ type: "SET_USER", payload: currentUser });
        history.push("/admin/dashboard");
      })
      .catch((err) => {
        if (err.code === "auth/email-already-in-use") {
          toast.error("User already exists");
        }
      });
  };


  //logout User
  const logoutUser = () => {
    fire
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: "RESET_USER" });
        toast.success("You are successfully logged out");
        history.push("/");
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="App">
      <ToastContainer />
      <Switch>
        <Route path={""}>
          {/* {isLoggedIn && !pathname.includes("/admin") ? <SubNavbar /> : null} */}
           <Navbar  logoutUser={logoutUser}/>
          <Route exact path={"/"}>
            <Home />
          </Route>
          <Route exact path={"/post/:id/:title"}>
            <SeePost />
          </Route>
          <Route path={"/admin"}>
            <Admin />
          </Route>
          <Route path={"/login"}>
            <Login loginUser={loginUser} />
          </Route>
          <Route path={"/register"}>
            <Register registerUser={registerUser} />
          </Route>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
