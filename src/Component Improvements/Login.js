import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import login from "../assets/img/login.jpg";
import { BookHalf } from "react-bootstrap-icons";
import firebase from '../metro.config';
import bcrypt from 'bcryptjs';

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
  const [passwordErrors, setPasswordErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (email && password && validateEmail(email)) {
      setValidationError("");
      const adminSnapshot = await firebase.firestore().collection('BiblioAdmin').doc(email).get();
      if (adminSnapshot.exists) {
        const adminData = adminSnapshot.data();
        const isPasswordValid = await bcrypt.compare(password, adminData.password);
        if (isPasswordValid) {
          const token = "fake-jwt-token";
          localStorage.setItem("token", token);
          localStorage.setItem("user_id", email); // Store the email as user_id
          navigate("/accueil");
        } else {
          setValidationError("Oops! Email and/or password incorrect");
        }
      } else {
        setValidationError("Oops! Email and/or password incorrect");
      }
    } else if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address");
    } else {
      setValidationError("Oops! Email and/or password incorrect");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, gender } = formData;

    if (!name || !email || !password || !confirmPassword || !gender) {
      setValidationError("Please fill in all the fields");
    } else if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address");
    } else if (password !== confirmPassword) {
      setValidationError("Password does not match");
    } else {
      const errors = validatePassword(password);
      if (Object.keys(errors).length > 0) {
        setPasswordErrors(errors);
        setValidationError("Password does not meet the requirements");
      } else {
        setValidationError("");
        setPasswordErrors({});
        const adminSnapshot = await firebase.firestore().collection('BiblioAdmin').doc(email).get();
        if (adminSnapshot.exists) {
          setValidationError("This email is already registered");
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          await firebase.firestore().collection('BiblioAdmin').doc(email).set({
            name,
            email,
            password: hashedPassword,
            gender,
            image: null,
            created_at: new Date(),
            updated_at: null,
          });
          localStorage.setItem("user_id", email); // Store the email as user_id after registration
          setRegistrationSuccess(true);
        }
      }
    }
  };

  const validatePassword = (password) => {
    const errors = {};
    const minLengthRegex = /.{8,}/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLengthRegex.test(password)) {
      errors.minLength = "Password must be at least 8 characters long";
    }
    if (!upperCaseRegex.test(password)) {
      errors.upperCase = "Password must contain at least one uppercase letter";
    }
    if (!lowerCaseRegex.test(password)) {
      errors.lowerCase = "Password must contain at least one lowercase letter";
    }
    if (!numberRegex.test(password)) {
      errors.number = "Password must contain at least one number";
    }
    if (!specialCharRegex.test(password)) {
      errors.specialChar = "Password must contain at least one special character";
    }

    return errors;
  };

  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      setPasswordErrors(validatePassword(e.target.value));
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-background">
        <div className="login-overlay">
          <div className="login-container">
            <h1>
              <BookHalf className="book-icon" />
              <span className="biblio-title">BIBLIO ENSPY</span>
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
                          style={{ width: "300px" }}
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
                          style={{ width: "300px" }}
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
                          style={{ width: "300px" }}
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
                          style={{ width: "300px" }}
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
                          style={{ width: "300px" }}
                          onChange={handleRegisterChange}
                          aria-required="true"
                        />
                      </div>
                      {Object.keys(passwordErrors).map((key) => (
                        <p key={key} className="error-message">{passwordErrors[key]}</p>
                      ))}
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
                          style={{ width: "300px" }}
                          onChange={handleRegisterChange}
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <div className="input-wrapper">
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          style={{ width: "300px" }}
                          onChange={handleRegisterChange}
                          aria-required="true"
                        >
                          <option value="">Select your gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
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

                {isLogin && (
                <button
                  className="link-button"
                  onClick={() => {
                    navigate("/forget-password");
                  }}
                > Forget password ?
                </button>
                )}
              </div>

              <img src={login} alt="login" className="login-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
