import styled from 'styled-components';

export const Container = styled.main`
  padding-top: 64px;

  h1 {
    font-family: 'Montserrat', sans-serif;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 25px 12px;

  h1 {
    margin-right: auto;
  }

  label {
    color: rgba(255, 255, 255, 0.76);
  }

  @media (max-width: 620px) {
    align-items: stretch;
    flex-direction: column;

    h1 {
      margin-right: 0;
    }
  }
`;

export const YearInput = styled.input`
  width: 145px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid rgba(255, 102, 0, 0.5);
  border-radius: 5px;
  background: #333;
  color: #fff;
  font-size: 16px;

  &:focus {
    border-color: #ff6600;
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.14);
  }

  @media (max-width: 620px) {
    width: 100%;
  }
`;

export const EmptyState = styled.p`
  margin: 12px 25px;
  padding: 18px;
  border-radius: 5px;
  background: #333;
  color: rgba(255, 255, 255, 0.72);
`;
