import styled from 'styled-components';

export const Container = styled.div`
    padding-top: 64px;

    h1{
        font-family: 'Montserrat', sans-serif;
    }
`;

export const PageHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 22px 25px 5px;

    @media (max-width: 520px) {
        align-items: flex-start;
        flex-direction: column;
    }
`;

export const SyncFeedback = styled.p`
    margin: 10px 25px;
    padding: 11px 14px;
    border-radius: 5px;
    background: rgba(255, 102, 0, 0.14);
`;

export const AlphabetFilter = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    margin: 12px 25px 5px;
    padding: 12px;
    border-radius: 6px;
    background: #333;
`;

export const LetterButton = styled.button`
    width: 31px;
    height: 31px;
    border: 1px solid ${props => props['aria-pressed'] ? '#ff6600' : 'rgba(255,255,255,0.18)'};
    border-radius: 4px;
    background: ${props => props['aria-pressed'] ? 'rgba(255,102,0,0.2)' : 'rgba(0,0,0,0.16)'};
    color: ${props => props['aria-pressed'] ? '#ff8f45' : 'rgba(255,255,255,0.75)'};
    font-weight: 700;
`;

export const ClearFilter = styled.button`
    min-height: 31px;
    margin-left: 7px;
    padding: 5px 11px;
    border: 1px solid rgba(255,102,0,0.45);
    border-radius: 4px;
    background: rgba(255,102,0,0.12);
    color: #ff9b59;

    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
`;
