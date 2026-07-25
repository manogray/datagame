import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  background: #333;
  border-bottom: 1px solid rgba(255,102,0,0.16);
  box-shadow: 0 3px 12px rgba(255,102,0,0.2);
  backdrop-filter: blur(8px);
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 150px;
  width: min(1100px, calc(100% - 30px));
  min-height: 64px;
  margin: 0 60px;

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 12px 0;
  }
`;

export const Brand = styled(Link)`
  color: #ff6600;
  font-family: 'Montserrat', sans-serif;
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  a {
    padding: 9px 12px;
    border-radius: 5px;
    color: rgba(255,102,0,0.70);
    transition: background 0.2s, color 0.2s;

    &:hover,
    &.active {
      background: rgba(255, 102, 0, 0.18);
      color: #ff6600;
    }
  }

  @media (max-width: 390px) {
    width: 100%;

    a {
      flex: 1;
      padding: 8px;
      text-align: center;
    }
  }
`;
