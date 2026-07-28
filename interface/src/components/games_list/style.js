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
    width: 100%;
    min-height: 280px;
    perspective: 1100px;
    cursor: pointer;

    &:hover > div,
    &:focus > div,
    &:focus-within > div {
        transform: rotateY(180deg);
    }
`;

export const CardInner = styled.div`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s ease;
`;

const CardFace = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    background: #333;
    box-shadow: 2px 3px 10px rgba(0,0,0,0.25);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
`;

export const FrontFace = styled(CardFace)`
    z-index: 2;
`;

export const BackFace = styled(CardFace)`
    transform: rotateY(180deg);
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
    align-items: center;
    max-width: 90%;
    text-align: center;

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
