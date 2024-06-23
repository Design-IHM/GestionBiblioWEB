import React, { useState } from "react";
import '../Component Improvements/Register.css'
import { useNavigate } from "react-router-dom";

export const Register = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const navigate = useNavigate();
  const { email, password, name } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <div className="auth-form-container">
      <h2>Authentification</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Full name</label>
        <input value={name} name="name" id="name" onChange={handleChange} placeholder="Full Name" />
        <label htmlFor="email">Email</label>
        <input value={email} onChange={handleChange} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
        <label htmlFor="password">Password</label>
        <input value={password} onChange={handleChange} type="password" placeholder="********" id="password" name="password" />
        <button type="submit" onClick={ () => navigate("/registrationValidation")}>Sign Up</button>
      </form>
      <button className="link-btn" onClick={() => navigate("/login")}>Already have an account? Login here.</button>
    </div>
  );
}