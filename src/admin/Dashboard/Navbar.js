import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, user } = useSelector(
    (state) => ({
      isLoggedIn: state.auth.isLoggedIn,
      user: state.auth.user,
    }),
    shallowEqual
  );

  return (
    <nav className="navbar navbar-expand py-3 navbar-light">
      <Link to="/"> -- </Link>
       <h3 className="font-italic">Dashboard</h3> 
      <div className="navbar-collapse">
      <ul className="navbar-nav ml-5 mr-auto">
        <li className="nav-item">
          <NavLink exact to="/admin/dashboard" className="nav-link">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact to="/admin/dashboard/addPost" className="nav-link">
            Add Post
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact to="/admin/dashboard/posts" className="nav-link">
            Your Posts
          </NavLink>
        </li>
      </ul>
      </div>
    </nav>
  );
};

export default Navbar;
