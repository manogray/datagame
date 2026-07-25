import styled from 'styled-components';

export const List = styled.div`
    position: relative;
    float: left;
    width: 100%;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 15px;
`;

export const Game = styled.div`
    position: relative;
    background: #333;
    float: left;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 15px;
    cursor: pointer;

    &:hover {
        transform: scale(1.05);
        transition: 0.2s;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
        z-index: 2;
    }
`;

export const GameCover = styled.div`
    width: 167px;
    min-width: 167px;
    height: 250px;
    box-shadow: 2px 3px 8px rgba(0,0,0,0.5);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;

export const Title = styled.span`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
`;

export const InfoLine = styled.span`
    font-size: 14px;
    margin-bottom: 10px;
`;

export const Info = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 15px;

    a {
        margin-top: 10px;
        color: rgba(255,255,255,0.75);
        font-size: 12px;
        text-decoration: underline;
    }
`;

export const Number = styled.p`
    margin: 0px 25px;
    font-size: 35px;
`;

export const Status = styled.span`
    color: ${props => props.status === 'finished' ? '#29ff29' : '#e6ff23'};
`;
