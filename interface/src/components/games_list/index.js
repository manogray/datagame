import React from 'react';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import {
  List,
  Game,
  CardInner,
  FrontFace,
  BackFace,
  Status,
  Info,
  Title,
  InfoLine,
  GameCover,
} from './style';

export default function GamesList({ data }){
  const history = useHistory();
  function getCover(game){
    if(game.coverSource === 'steam' && game.steamAppId){
      return `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/library_600x900.jpg`;
    }

    return game.coverUrl || `${api.defaults.baseURL}/img/${game.photo}`;
  }

  function getFallbackCover(game){
    if(game.fallbackCoverUrl){
      return game.fallbackCoverUrl;
    }

    if(game.coverSource === 'steam' && game.steamAppId && game.coverUrl){
      return game.coverUrl;
    }

    if(game.photo){
      return `${api.defaults.baseURL}/img/${game.photo}`;
    }

    return '';
  }

  function shouldShowSteamPlaytime(game){
    const hasImportedPlaytime = game.steamPlaytimeMinutes != null;
    const isInProgress = game.status === 'progress';
    const wasFinishedOnSteam = game.status === 'finished'
      && String(game.platform || '').toLowerCase() === 'steam';

    return hasImportedPlaytime && (isInProgress || wasFinishedOnSteam);
  }

  return (
    <List>
        { data.map(game => {
          const cover = getCover(game);
          const fallback = getFallbackCover(game);
          const gameId = game._id || game.id;

          return (
          <Game
            key={gameId}
            role="link"
            tabIndex="0"
            onClick={event => {
              if(!event.target.closest('a')) history.push(`/games/${gameId}/edit`);
            }}
            onKeyDown={event => {
              if(event.key === 'Enter' || event.key === ' ') history.push(`/games/${gameId}/edit`);
            }}
          >
            <CardInner>
              <FrontFace>
                <GameCover
                  style={{
                    backgroundImage: fallback
                      ? `url("${cover}"), url("${fallback}")`
                      : `url("${cover}")`
                  }}
                />
              </FrontFace>

              <BackFace>
                <Info>
                  <Title>{game.name}</Title>
                  {game.status === 'finished' && game.year && (
                    <InfoLine>Zerado em {game.year}</InfoLine>
                  )}
                  {game.status === 'finished' && game.platform && (
                    <InfoLine>Plataforma: {game.platform}</InfoLine>
                  )}
                  {shouldShowSteamPlaytime(game) && (
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
              </BackFace>
            </CardInner>
          </Game>
          );
        }) }
    </List>
  );
}
