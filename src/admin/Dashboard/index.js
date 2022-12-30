import React from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import Home from "./Home";
import AddPost from "./AddPost";
import Navbar from "./Navbar";
import Posts from "./Posts";
import SeePost from "./SeePost";
import EditPost from "./EditPost";
import Notifications from "./Notifications";

const Dashboard = () => {
  const { path } = useRouteMatch();
 // console.log(`path`, path);

  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path={path}>
          <Home />
        </Route>
        <Route exact path={`${path}/addPost`}>
          <AddPost />
        </Route>
        <Route exact path={`${path}/posts`}>
          <Posts />
        </Route>
        <Route exact path={`${path}/notifications`}>
          <Notifications/>
        </Route>
        <Route exact path={`${path}/post/:id`}>
          <SeePost />
        </Route>
        <Route exact path={`${path}/post/:id/edit`}>
          <EditPost />
        </Route>
      </Switch>
    </>
  );
};

export default Dashboard;

