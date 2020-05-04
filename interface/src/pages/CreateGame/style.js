import styled from 'styled-components';
import { Form, Input } from '@rocketseat/unform';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;
`;

export const MyForm = styled(Form)`
    display: flex;
    margin-top: 25px;
`;

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const UploadBox = styled.div`
    width: 350px;
    background: #fff;
    margin: 30px;
    border-radius: 4px 4px 0px 0px;
`;

export const Label = styled.label`
`;

export const MyInput = styled(Input)`
    background: none;
    border: none;
    color: #f5f5f5;
    transition: .4s;
    padding: 15px;

    &:focus{
        font-size: 35px;
        border-bottom: 1px solid #f5f5f5;
    }

    &::placeholder{
        color: #f5f5f5;
    }
`;