import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = ({ logoutUser }) => {
  const { isLoggedIn, user } = useSelector(
    (state) => ({
      user: state.auth.user,
      isLoggedIn: state.auth.isLoggedIn,
    }),
    shallowEqual
  );
  return (
    <nav className="navbar shadow navbar-expand-lg py-3 navbar-light ">
      <h1>
        <Link to="/" className="ml-5 font-italic font-weight-bolder">
          Wall of Words
        </Link>
      </h1>

      <ul className="navbar-nav ml-auto mr-5">
        <li className="nav-item">
          {/* <div className="col-md-12 d-flex align-items-center">
      <p className="font-weight-bold small ml-auto mt-3">
        Welcome, <span className="text-primary">{user?.displayName}</span>
      </p>
      <Link to="/admin" className="btn btn-success btn-sm h-50 ml-2">
        Your profile
      </Link>
    </div> */}
          {isLoggedIn ? (
            <>
              Welcome , <span className="text-warning">{user.displayName}</span>
              <button className="btn btn-outline-dark ml-3">
                <Link to="/admin" className="text-dark">
                  View your profile
                </Link>
              </button>
              <button
                className="btn btn-primary ml-3"
                onClick={() => logoutUser()}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-success btn-sm ml-2">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
