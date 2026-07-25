import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 20px;

  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const Chart = styled.div`
  width: 210px;
  min-width: 210px;
  height: 210px;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0,0,0,0.28);
`;

export const EmptyChart = styled.div`
  width: 210px;
  min-width: 210px;
  height: 210px;
  display: grid;
  place-items: center;
  border: 2px dashed rgba(255,255,255,0.2);
  border-radius: 50%;
  color: rgba(255,255,255,0.55);
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

export const Color = styled.span`
  width: 13px;
  min-width: 13px;
  height: 13px;
  border-radius: 3px;
`;

export const LegendText = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: rgba(255,255,255,0.62);
    font-size: 12px;
  }
`;
