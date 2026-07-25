import styled from 'styled-components';

export const Container = styled.main`
  width: min(1100px, calc(100% - 30px));
  margin: 35px auto 60px;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
  h1 { color: #ff6600; font-family: 'Montserrat', sans-serif; }
  p { margin-top: 6px; color: rgba(255,255,255,0.72); }
  @media (max-width: 580px) { align-items: flex-start; flex-direction: column; }
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  @media (max-width: 850px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const Card = styled.article`
  grid-column: span ${props => props.featured ? 3 : 2};
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
  border: 1px solid ${props => props.featured ? 'rgba(255,102,0,0.55)' : 'rgba(255,255,255,0.14)'};
  border-radius: 8px;
  background: ${props => props.featured ? 'rgba(255,102,0,0.11)' : '#333'};
  box-shadow: 2px 3px 10px rgba(0,0,0,0.22);
  @media (max-width: 850px) { grid-column: span 1; }
`;

export const Label = styled.span`color: rgba(255,255,255,0.72); font-size: 14px;`;
export const Value = styled.strong`
  margin: 12px 0;
  color: #ff6600;
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => props.small ? '32px' : '52px'};
  line-height: 1;
`;
export const Detail = styled.span`color: rgba(255,255,255,0.72); font-size: 13px;`;
export const UpdatedAt = styled.span`color: rgba(255,255,255,0.58); font-size: 12px;`;
export const Feedback = styled.p`padding: 15px; border-radius: 6px; background: #333;`;

export const ChartsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
  margin-top: 15px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.article`
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 8px;
  background: #333;
  box-shadow: 2px 3px 10px rgba(0,0,0,0.22);

  h2 {
    color: #ff6600;
    font-size: 18px;
  }

  > p {
    margin-top: 5px;
    color: rgba(255,255,255,0.65);
    font-size: 13px;
  }
`;

export const BackupSection = styled.section`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 18px;
  margin-top: 15px;
  padding: 24px;
  border: 1px solid rgba(255, 102, 0, 0.42);
  border-radius: 8px;
  background: #333;

  h2 {
    color: #ff6600;
    font-size: 18px;
  }

  p {
    margin-top: 5px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 13px;
  }

  > ${Feedback} {
    grid-column: 1 / -1;
    margin: 0;
    background: rgba(255, 102, 0, 0.13);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const BackupActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const BackupButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #ff6600;
  border-radius: 5px;
  background: rgba(255, 102, 0, 0.13);
  color: #ff8f45;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: rgba(255, 102, 0, 0.23);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;
