import React from 'react';

import { List, Game, Status, Info, Title, InfoLine, Number } from './style';

export default function GamesList({ data }){
  return (
    <List>
        { data.map(game => (
          <Game key={game.id}>
            <Number>#</Number>
            <img src={'http://localhost:3001/img/'+game.photo} alt=""/>
            <Info>
              <Title>{game.name}</Title>
              <InfoLine>{game.platform}</InfoLine>
              <InfoLine>{game.year}</InfoLine>
              <Status status={game.status}>{ game.status == 'finished' ? 'Zerado' : 'Em progresso' }</Status>
            </Info>
          </Game>
        )) }
    </List>
  );
}
