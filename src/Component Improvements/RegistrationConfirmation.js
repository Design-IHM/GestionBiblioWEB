import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./RegistrationConfirmation.css";
import Loading from "../components1/Loading";

const RegistrationConfirmation = () => {
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoading(false);
        }, 7000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <>
            {showLoading ? (
                <div className="loading-container">
                    <Loading />
                </div>
            ) : (
                <div className="registration-confirmation-container">
                    <h2>Registration Successful!</h2>
                    <p>Your registration has been successfully completed.</p>
                    <p>Thank you for joining us!</p>
                    <Link to="/" className="login-link">
                        Go to Login
                    </Link>
                </div>
            )}
        </>
    );
};

export default RegistrationConfirmation;