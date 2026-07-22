import styled from 'styled-components';
import { Form, Input } from '@rocketseat/unform';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;
    width: 100%;
`;

export const SearchArea = styled.section`
    width: min(900px, calc(100% - 30px));
    margin-top: 25px;
    padding: 20px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.18);

    h2 {
        font-size: 18px;
        margin-bottom: 12px;
    }
`;

export const SearchControls = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    button {
        flex-shrink: 0;
    }
`;

export const SourceOptions = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
`;

export const SourceButton = styled.button`
    padding: 8px 12px;
    border: 1px solid ${props => props['aria-pressed'] ? '#ff6600' : 'rgba(255,255,255,0.3)'};
    border-radius: 5px;
    background: ${props => props['aria-pressed'] ? 'rgba(255, 102, 0, 0.18)' : 'rgba(0,0,0,0.14)'};
    color: #fff;
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid rgba(255,255,255,0.35);
    border-radius: 6px;
    background: rgba(255,255,255,0.12);
    color: #fff;

    &::placeholder {
        color: rgba(255,255,255,0.7);
    }
`;

export const Results = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 12px;
    margin-top: 15px;
`;

export const Result = styled.button`
    display: flex;
    min-height: 112px;
    padding: 8px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    background: rgba(0,0,0,0.22);
    color: #fff;
    text-align: left;

    &:hover, &:focus {
        border-color: #ff6600;
        transform: translateY(-1px);
    }
`;

export const ResultImage = styled.img`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 68px;
    min-width: 68px;
    height: 96px;
    object-fit: cover;
    border-radius: 4px;
    background: #17334c;
    color: #bbb;
    font-size: 11px;
`;

export const ResultInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 10px;
    overflow: hidden;

    span {
        color: rgba(255,255,255,0.72);
        font-size: 12px;
    }
`;

export const Attribution = styled.p`
    margin-top: 12px;
    font-size: 12px;
    color: rgba(255,255,255,0.7);

    a {
        color: #fff;
        text-decoration: underline;
    }
`;

export const SelectedCover = styled.div`
    display: flex;
    align-items: center;
    width: min(500px, calc(100% - 30px));
    margin-top: 18px;
    padding: 12px;
    border-radius: 6px;
    background: rgba(255,255,255,0.94);
    color: #333;

    img {
        width: 70px;
        height: 98px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 12px;
    }

    div {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
`;

export const Feedback = styled.p`
    margin-top: 15px;
    padding: 10px 14px;
    border-radius: 4px;
    background: rgba(0,0,0,0.22);
`;

export const MyForm = styled(Form)`
    display: flex;
    margin-top: 25px;
    align-items: flex-start;

    @media (max-width: 720px) {
        flex-direction: column;
        width: calc(100% - 30px);
    }
`;

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 330px;

    @media (max-width: 720px) {
        width: 100%;
        min-width: 0;
    }
`;

export const UploadBox = styled.div`
    width: 350px;
    background: #fff;
    margin: 30px;
    border-radius: 4px;

    @media (max-width: 720px) {
        width: 100%;
        margin: 20px 0;
    }
`;

export const MyInput = styled(Input)`
    background: none;
    border: none;
    border-bottom: 1px solid transparent;
    color: #f5f5f5;
    transition: .2s;
    padding: 15px;

    &:focus {
        border-bottom-color: #f5f5f5;
    }

    &::placeholder {
        color: #f5f5f5;
    }
`;
