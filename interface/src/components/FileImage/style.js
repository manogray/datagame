import styled from 'styled-components';

export const Container = styled.div`
    background: #fff;
    width: 100%;
    padding: 15px;

    display: flex;
    justify-content: space-between;
    color: #333;

    border-radius: 0px 0px 4px 4px;
`;

export const FileInfo = styled.div`
    display: flex;
    align-items: center;

    div {
        display:flex;
        flex-direction: column;

        span {
            font-size: 12px;
            color: #999;
        }
    }
`;

export const Preview = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 5px;
    background: url(${props => props.src});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 10px;
`;
