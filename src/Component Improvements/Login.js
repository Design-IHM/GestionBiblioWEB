import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import login from "../../../GestionBiblioWEB/src/assets/img/login.jpg"
import {BookHalf} from "react-bootstrap-icons";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email && password && validateEmail(email)) {
      setValidationError("");
      navigate("/accueil");
    } else if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address");
    } else {
      setValidationError("Oops! Email and/or password incorrect");
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setValidationError("Please fill in all the fields");
    } else if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address");
    } else if (password !== confirmPassword) {
      setValidationError("Password does not match");
    } else {
      setValidationError("");
      setRegistrationSuccess(true);
    }
  };

  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-wrapper">
      <div className="login-background">
        <div className="login-overlay">
          <div className="login-container">
            <h1>
              <BookHalf
                className="book-icon"
              />
              <span className="biblio-title">BIBIO ENSPY</span>
            </h1>
            {validationError && (
              <p className="error-message">{validationError}</p>
            )}
            {registrationSuccess && (
              <p className="success-message">
              You have been successfully registered! Please log in to access the platform.
              </p>
            )}
            <div className="content">
              <div className="auth-form-container">
                <h2>{isLogin ? "Login" : "Registration"}</h2>
                {isLogin ? (
                  <form className="login-form" onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <div className="input-wrapper">
                        <i className="fas fa-envelope"></i>
                        <input
                          type="email"
                          placeholder="youremail@gmail.com"
                          id="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="input-wrapper">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          placeholder="********"
                          id="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <button type="submit" className="login-button">
                      Log In
                    </button>
                  </form>
                ) : (
                  <form className="login-form" onSubmit={handleRegisterSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <div className="input-wrapper">
                        <i className="fas fa-user"></i>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleRegisterChange}
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <div className="input-wrapper">
                        <i className="fas fa-envelope"></i>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleRegisterChange}
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="input-wrapper">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleRegisterChange}
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="input-wrapper">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleRegisterChange}
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <button type="submit" className="login-button">
                      Register
                    </button>
                  </form>
                )}
                <button
                  className="link-button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setValidationError("");
                    setRegistrationSuccess(false);
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Register here."
                    : "Already have an account? Login here."}
                </button>
              </div>

              <img
                src={login}
                alt="login"
                className="login-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
