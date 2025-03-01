import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import login from "../assets/img/login.jpg";
import { BookHalf } from "react-bootstrap-icons";
import bcrypt from 'bcryptjs';
import firebase from '../metro.config';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      const resetEmail = localStorage.getItem("reset_email");
      if (resetEmail) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await firebase.firestore().collection('BiblioAdmin').doc(resetEmail).update({
          password: hashedPassword,
          updated_at: new Date()
        });
        setResetSuccess(true);
        setValidationError("");
        localStorage.removeItem("reset_email"); // Remove the email from localStorage after successful reset
        setTimeout(() => {
          navigate("/");
        }, 3000); // Redirect to login after 3 seconds
      } else {
        setValidationError("Invalid reset link.");
      }
    } catch (error) {
      setValidationError("Failed to reset password. Please try again.");
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
                Your password has been successfully reset! Redirecting...
              </p>
            )}
            <div className="content">
              <div className="auth-form-container">
                <h2>Reset Password</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <div className="input-wrapper">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        id="password"
                        name="password"
                        value={password}
                        style={{ width: "300px" }}
                        onChange={(e) => setPassword(e.target.value)}
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
                        placeholder="Confirm new password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        style={{ width: "300px" }}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <button type="submit" className="login-button">
                    Reset
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

export default ResetPassword;
