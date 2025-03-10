import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from 'emailjs-com';
import "./Login.css";
import login from "../assets/img/login.jpg";
import { BookHalf } from "react-bootstrap-icons";
import { front_end_url } from "../utils/url";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID
} from "../utils/emailConfig";
import firebase from '../metro.config';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    try {
      const adminSnapshot = await firebase.firestore().collection('BiblioAdmin').doc(email).get();
      if (adminSnapshot.exists) {
        const templateParams = {
          to_email: email,
          reset_link: `${front_end_url}/reset-password`,
        };

        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        if (response.status === 200) {
          setRegistrationSuccess(true);
          setValidationError("");
          localStorage.setItem("reset_email", email); // Store the email in localStorage
        } else {
          setValidationError("Failed to send reset email. Please try again.");
        }
      } else {
        setValidationError("Email does not exist.");
      }
    } catch (error) {
      setValidationError("Failed to send reset email. Please try again.");
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
                A password reset link has been sent to your email!
              </p>
            )}
            <div className="content">
              <div className="auth-form-container">
                <h2>Forget Password</h2>
                <form className="login-form" onSubmit={handleSubmit}>
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
                  <button type="submit" className="login-button">
                    Send
                  </button>
                </form>
                <button
                  className="link-button"
                  onClick={() => navigate("/")}
                >
                  Already have an account? Login here.
                </button>
              </div>
              <img src={login} alt="login" className="login-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
