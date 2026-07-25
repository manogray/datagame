import React from 'react';

import { Container, Chart, EmptyChart, Legend, LegendItem, Color, LegendText } from './style';

export default function PieChart({ items }){
  const visibleItems = items.filter(item => item.value > 0);
  const total = visibleItems.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;

  const slices = visibleItems.map(item => {
    const start = (accumulated / total) * 100;
    accumulated += item.value;
    const end = (accumulated / total) * 100;
    return `${item.color} ${start}% ${end}%`;
  });

  return (
    <Container>
      {total ? (
        <Chart
          style={{ background: `conic-gradient(${slices.join(', ')})` }}
          role="img"
          aria-label={visibleItems.map(item => `${item.label}: ${item.value}`).join(', ')}
        />
      ) : (
        <EmptyChart>Sem dados</EmptyChart>
      )}

      <Legend>
        {visibleItems.map(item => (
          <LegendItem key={item.label}>
            <Color style={{ background: item.color }} />
            <LegendText>
              <strong>{item.label}</strong>
              <span>{item.value} ({Math.round((item.value / total) * 100)}%)</span>
            </LegendText>
          </LegendItem>
        ))}
      </Legend>
    </Container>
  );
}
