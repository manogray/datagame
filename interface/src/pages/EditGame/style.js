import styled from 'styled-components';

export const BackLink = styled.a`
  align-self: flex-start;
  margin-left: max(15px, calc((100% - 900px) / 2));
  color: #fff;
  text-decoration: underline;
`;

export const CurrentCover = styled.div`
  display: flex;
  align-items: center;
  width: min(500px, calc(100% - 30px));
  margin-top: 18px;
  padding: 12px;
  border-radius: 6px;
  background: rgba(255,255,255,0.94);
  color: #333;

  img {
    width: 100px;
    height: 150px;
    margin-right: 14px;
    border-radius: 4px;
    object-fit: cover;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

export const DeleteButton = styled.button`
  margin: 10px 15px;
  padding: 10px 20px;
  border: 1px solid #ff5050;
  border-radius: 6px;
  background: rgba(255, 50, 50, 0.18);
  color: #fff;
  font-size: 16px;
`;

export const SteamInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  width: min(500px, calc(100% - 30px));
  margin-top: 12px;
  padding: 12px 15px;
  border: 1px solid rgba(255,102,0,0.35);
  border-radius: 6px;
  background: rgba(255,102,0,0.1);

  span {
    color: rgba(255,255,255,0.72);
  }

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;
