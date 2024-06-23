import React, { useState } from "react";
import "./RegistrationValidation.css";
import { useNavigate } from "react-router-dom";

const RegistrationValidation = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [validationError, setValidationError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Effectuer la validation du formulaire ici
        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password || !confirmPassword) {
            setValidationError("Please fill in all the fields");
        } else if (password !== confirmPassword) {
            setValidationError("Password does not match");
        } else {
            setValidationError("");
            navigate("/registrationConfirmation");
            console.log("Registration successful!");
        }
    };

    const navigate = useNavigate();

    return (

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
                {validationError && (
                    <p className="error-message">{validationError}</p>
                )}
                <button type="submit" className="submit-button" >Validate Registration</button>
                <button className="link-btn" onClick={() => navigate("/")}>Already have an account? Login here.</button>

            </form>
        </div>
    );
};

export default RegistrationValidation;