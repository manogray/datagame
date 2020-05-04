import styled, { css } from 'styled-components';

const dragActive = css`
    border-color: #29ff29;
`;

const dragReject = css`
    border-color: red;
`;

export const DropContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 10px;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #333;
    cursor: pointer;

    transition: height 0.2s ease;

    ${props => props.isDragActive && dragActive};
    ${props => props.isDragReject && dragReject};
`;

export const UploadMessage = styled.p`
    text-align: center;
`;
