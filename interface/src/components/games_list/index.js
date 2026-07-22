import React from 'react';

import api from '../../services/api';

import { List, Game, Status, Info, Title, InfoLine, Number, GameCover } from './style';

export default function GamesList({ data }){
  function getCover(game){
    if(game.steamAppId){
      return `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/library_600x900.jpg`;
    }

    return game.coverUrl || `${api.defaults.baseURL}/img/${game.photo}`;
  }

  function getFallbackCover(game){
    if(game.fallbackCoverUrl){
      return game.fallbackCoverUrl;
    }

    if(game.steamAppId && game.coverUrl){
      return game.coverUrl;
    }

    if(game.photo){
      return `${api.defaults.baseURL}/img/${game.photo}`;
    }

    return '';
  }

  return (
    <List>
        { data.map(game => {
          const cover = getCover(game);
          const fallback = getFallbackCover(game);

          return (
          <Game key={game.id}>
            <GameCover
              style={{
                backgroundImage: fallback
                  ? `url("${cover}"), url("${fallback}")`
                  : `url("${cover}")`
              }}
            >
            </GameCover>
            <Info>
              <Title>{game.name}</Title>
              <InfoLine>{game.platform}</InfoLine>
              <InfoLine>{game.year}</InfoLine>
              {game.steamPlaytimeMinutes != null && (
                <InfoLine>{Math.round(game.steamPlaytimeMinutes / 6) / 10} horas na Steam</InfoLine>
              )}
              <Status status={game.status}>{ game.status === 'finished' ? 'Zerado' : 'Em progresso' }</Status>
              {game.coverSource === 'rawg' && game.sourceUrl && (
                <a href={game.sourceUrl} target="_blank" rel="noopener noreferrer">Dados e imagem: RAWG</a>
              )}
              {game.steamAppId && (
                <a href={`https://store.steampowered.com/app/${game.steamAppId}`} target="_blank" rel="noopener noreferrer">Biblioteca e tempo jogado: Steam</a>
              )}
              {game.coverSource === 'steam' && game.sourceUrl && !game.steamAppId && (
                <a href={game.sourceUrl} target="_blank" rel="noopener noreferrer">Dados e imagem: Steam</a>
              )}
            </Info>
          </Game>
          );
        }) }
    </List>
  );
}
