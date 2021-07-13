import React, { useContext, useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab, faGoogle } from "@fortawesome/free-brands-svg-icons";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";

library.add(fab, faGoogle);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Login = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordNotMatched, setPasswordNotMatched] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const handleOnBlur = (event) => {
    const eventName = event.target.name;
    const userInfo = { ...user };
    if (eventName === "name") {
      userInfo.name = event.target.value;
    } else if (
      eventName === "email" &&
      /\S+@\S+\.\S+/.test(event.target.value)
    ) {
      userInfo.email = event.target.value;
    } else if (eventName === "newPassword" && event.target.value.length >= 6) {
      userInfo.password = event.target.value;
    } else if (
      eventName === "confirmPassword" &&
      event.target.value.length >= 6
    ) {
      userInfo.confirmPassword = event.target.value;
    }
    setUser(userInfo);
  };

  const handleEmailAndPasswordSignUp = (event) => {
    if (user.password === user.confirmPassword) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          const { email } = userCredential.user;
          const displayName = user.name;
          const signedInUser = { name: displayName, email };
          setLoggedInUser(signedInUser);
          sessionStorage.setItem("user", email);
          history.replace(from);
        })
        .catch((error) => {
          setPasswordNotMatched(false);
          const errorMessage = error.message;
          setError(errorMessage);
        });
    } else {
      setError("");
      setPasswordNotMatched(true);
    }

    event.preventDefault();
  };

  const handleEmailAndPasswordSignIn = (event) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then((userCredential) => {
        const { email } = userCredential.user;
        const displayName = user.name;
        const signedInUser = { name: displayName, email };
        setLoggedInUser(signedInUser);
        sessionStorage.setItem("user", email);
        history.replace(from);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });
    event.preventDefault();
  };

  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, email } = result.user;
        const signedInUser = { name: displayName, email };
        setLoggedInUser(signedInUser);
        sessionStorage.setItem("user", email);
        history.replace(from);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  const [signUpForm, setSignUpForm] = useState(true);
  const [logInForm, setLogInForm] = useState(false);

  return (
    <>
      <div className="container login-page d-flex justify-content-center">
        <div className="login-form">
          <div style={{ border: "1px solid gray", borderRadius: "5px" }}>
            {signUpForm && (
              <form
                className="form-content"
                onSubmit={handleEmailAndPasswordSignUp}
              >
                <h3 className="mb-4">Create an account</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onBlur={handleOnBlur}
                  className="form-input mb-3"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onBlur={handleOnBlur}
                  className="form-input mb-3"
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Password"
                  onBlur={handleOnBlur}
                  className="form-input mb-3"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  id=""
                  placeholder="Confirm Password"
                  onBlur={handleOnBlur}
                  className="form-input mb-3"
                  required
                />
                <input
                  type="submit"
                  value="Create an account"
                  className="mb-3 submit-btn"
                />
                {passwordNotMatched && (
                  <p style={{ color: "red" }}>
                    Password &amp; Confirm password didn't match.
                  </p>
                )}
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p>
                  Already have an account?{" "}
                  <span
                    className="toggle-form"
                    onClick={() => {
                      setSignUpForm(!signUpForm);
                      setLogInForm(!logInForm);
                    }}
                  >
                    Login
                  </span>
                </p>
              </form>
            )}
            {logInForm && (
              <form
                className="form-content"
                onSubmit={handleEmailAndPasswordSignIn}
              >
                <h3 className="mb-4">Login</h3>
                <input
                  type="email"
                  name="email"
                  id=""
                  placeholder="Email"
                  onBlur={handleOnBlur}
                  className="form-input mb-3"
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  id=""
                  placeholder="Password"
                  onBlur={handleOnBlur}
                  className="form-input mb-3"
                  required
                />
                <input
                  type="submit"
                  value="Login"
                  className="mb-3 submit-btn"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p>
                  Don't have an account?{" "}
                  <span
                    className="toggle-form"
                    onClick={() => {
                      setSignUpForm(!signUpForm);
                      setLogInForm(!logInForm);
                    }}
                  >
                    Create an account
                  </span>
                </p>
              </form>
            )}
          </div>
          <p className="style-or">
            <span>Or</span>
          </p>
          <div className="d-flex justify-content-center">
            <p className="google-btn" onClick={handleGoogleSignIn}>
              <FontAwesomeIcon
                className="google-icon"
                icon={["fab", "google"]}
              />
              Continue with Google
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
