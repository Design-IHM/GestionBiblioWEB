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
import bcrypt from 'bcryptjs';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const navigate = useNavigate();
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setValidationError("Please enter your current password.");
      return;
    }

    try {
      const adminDoc = await firebase.firestore().collection('BiblioAdmin').doc(user_id).get();
      if (adminDoc.exists) {
        const adminData = adminDoc.data();
        const isPasswordValid = await bcrypt.compare(currentPassword, adminData.password);
        if (isPasswordValid) {
          const templateParams = {
            to_email: user_id,
            reset_link: `${front_end_url}/reset-password`,
          };

          const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
          );

          if (response.status === 200) {
            setResetSuccess(true);
            setValidationError("");
            localStorage.setItem("reset_email", user_id); // Store the email in localStorage
          } else {
            setValidationError("Failed to send reset email. Please try again.");
          }
        } else {
          setValidationError("Incorrect current password.");
        }
      } else {
        setValidationError("User not found.");
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
            {resetSuccess && (
              <p className="success-message">
                Change password mail sent!
              </p>
            )}
            <div className="content">
              <div className="auth-form-container">
                <h2>Change Password</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="input-wrapper">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Enter your current password"
                        id="currentPassword"
                        name="currentPassword"
                        value={currentPassword}
                        style={{ width: "300px" }}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <button type="submit" className="login-button">
                    Send
                  </button>
                </form>
                
              </div>
              <img src={login} alt="login" className="login-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
