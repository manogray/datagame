import styled from 'styled-components';

export const List = styled.div`
    position: relative;
    float: left;
    width: 100%;
    padding: 10px;
`;

export const Game = styled.div`
    position: relative;
    float: left;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 25px 0px;
    border-bottom: 1px solid #f5f5f5;

    img{
        width: 145px;
        height: 203px;
        box-shadow: 2px 3px 8px rgba(0,0,0,0.5);
    }
`;

export const Title = styled.span`
    font-size: 18px;
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
`;

export const Number = styled.p`
    margin: 0px 25px;
    font-size: 35px;
`;

export const Status = styled.span`
    color: ${props => props.status == 'finished' ? '#29ff29' : '#e6ff23'};
`;
