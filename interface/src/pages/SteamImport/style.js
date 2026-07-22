import styled, { css } from 'styled-components';

const field = css`
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 6px;
  background: rgba(255,255,255,0.12);
  color: #fff;

  &::placeholder {
    color: rgba(255,255,255,0.7);
  }
`;

export const Container = styled.main`
  width: min(1050px, calc(100% - 30px));
  margin: 25px auto 60px;

  > h1 {
    margin: 15px 0 8px;
  }

  > p {
    color: rgba(255,255,255,0.8);
  }
`;

export const BackLink = styled.a`
  color: #fff;
  text-decoration: underline;
`;

export const SearchBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 22px;

  @media (max-width: 620px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const SearchInput = styled.input`
  ${field};
  flex: 1;
`;

export const FilterInput = styled.input`
  ${field};
  width: min(420px, 100%);
`;

export const Feedback = styled.p`
  margin-top: 15px;
  padding: 10px 14px;
  border-radius: 4px;
  background: rgba(0,0,0,0.22);
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin: 24px 0 15px;
`;

export const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 12px;
`;

export const GameCard = styled.button`
  display: flex;
  min-height: 105px;
  padding: 12px;
  border: 2px solid ${props => props.selected ? '#29ffb8' : 'rgba(255,255,255,0.18)'};
  border-radius: 7px;
  background: ${props => props.selected ? 'rgba(41,255,184,0.14)' : 'rgba(0,0,0,0.2)'};
  color: #fff;
  text-align: left;
  opacity: ${props => props.disabled ? 0.48 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

export const GameIcon = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 58px;
  min-width: 58px;
  height: 58px;
  border-radius: 5px;
  object-fit: cover;
  background: #17334c;
  font-size: 11px;
`;

export const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-left: 10px;

  span {
    color: rgba(255,255,255,0.72);
    font-size: 12px;
  }

  em {
    color: #ffd37a;
    font-size: 12px;
  }
`;

export const StatusSelect = styled.select`
  max-width: 135px;
  padding: 5px;
  border: 0;
  border-radius: 4px;
`;

export const Actions = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 10px;
  background: rgba(0,46,97,0.94);
`;
