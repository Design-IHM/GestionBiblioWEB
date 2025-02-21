// components/CustomAlert.js
import React from "react";
import styled from "styled-components";

const CustomAlert = ({ type, message, onClose }) => {
    return (
        <AlertContainer type={type}>
            <span>{message}</span>
            <CloseButton onClick={onClose}>×</CloseButton>
        </AlertContainer>
    );
};

const AlertContainer = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 20px;
    background-color: ${props => (props.type === "success" ? "#4CAF50" : "#f44336")};
    color: white;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    margin-left: 10px;
`;

export default CustomAlert;