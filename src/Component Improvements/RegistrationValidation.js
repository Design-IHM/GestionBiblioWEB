import React, { useState } from "react";
import "./RegistrationValidation.css";
import { useNavigate } from "react-router-dom";
import firebase from '../metro.config';
import bcrypt from 'bcryptjs';

const RegistrationValidation = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
    });
    const [validationError, setValidationError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, gender } = formData;

        if (!name || !email || !password || !confirmPassword || !gender) {
            setValidationError("Please fill in all the fields");
        } else if (password !== confirmPassword) {
            setValidationError("Password does not match");
        } else {
            setValidationError("");
            const hashedPassword = await bcrypt.hash(password, 10);
            await firebase.firestore().collection('BiblioAdmin').add({
                name,
                email,
                password: hashedPassword,
                gender,
                image: null,
                created_at: new Date(),
                updated_at: null,
            });
            navigate("/registrationConfirmation");
            console.log("Registration successful!");
        }
    };

    const navigate = useNavigate();

    return (
        <div className="registration-wrapper">
            <div className="registration-backgroud">
            <div className="registration-overlay">
                <div className="registration-validation-container">
                    <h2>Registration Validation</h2>
                    <form className="registration-validation-form" onSubmit={handleSubmit}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select your gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {validationError && (
                            <p className="error-message">{validationError}</p>
                        )}
                        <button type="submit" className="submit-button" >Validate Registration</button>
                        <button className="link-btn" onClick={() => navigate("/")}>Already have an account? Login here.</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
};

export default RegistrationValidation;
