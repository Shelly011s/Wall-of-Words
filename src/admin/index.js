import React, { useEffect } from "react";
import { Switch, Route, useHistory, useRouteMatch } from "react-router-dom";
import fire from "../config/fire";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./Dashboard";

const Admin = () => {
  const history = useHistory();
  let { path } = useRouteMatch();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        if (!isLoggedIn) dispatch({ type: "SET_USER", payload: user });
        if (window.location.pathname === "/admin")
          history.push("/admin/dashboard");
        history.push(window.location.pathname);
      } else {
        history.push("/register");
      }
    });
  }, [dispatch]);


  return (
    <Switch>
      <Route path={`${path}/dashboard`}>
        <Dashboard />
      </Route>
    </Switch>
  );
};

export default Admin;
