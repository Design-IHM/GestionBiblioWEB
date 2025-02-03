import { css } from "styled-components";

export const cardStyles = css`
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin: 1rem;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;
