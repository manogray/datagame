import React, { useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import Button from '../../components/button';

import {
  Container,
  SearchBox,
  SearchInput,
  Toolbar,
  FilterInput,
  GamesGrid,
  GameCard,
  GameIcon,
  GameInfo,
  StatusSelect,
  Feedback,
  Actions,
  BackLink,
} from './style';

function formatPlaytime(minutes){
  if(!minutes) return 'Não jogado';
  if(minutes < 60) return `${minutes} min`;
  return `${Math.round(minutes / 6) / 10} h jogadas`;
}

export default function SteamImport(){
  const history = useHistory();
  const [profile, setProfile] = useState('');
  const [steamId, setSteamId] = useState('');
  const [games, setGames] = useState([]);
  const [selected, setSelected] = useState({});
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const visibleGames = useMemo(() => {
    const term = filter.trim().toLowerCase();
    return games.filter(game => !term || game.name.toLowerCase().includes(term));
  }, [games, filter]);

  const selectedCount = Object.keys(selected).length;

  async function loadLibrary(){
    if(!profile.trim()){
      setFeedback('Informe o SteamID ou link do perfil.');
      return;
    }

    setLoading(true);
    setFeedback('');
    setSelected({});

    try {
      const response = await api.get('/steam/library', { params: { profile } });
      setSteamId(response.data.steamId);
      setGames(response.data.games);
      setFeedback(`${response.data.games.length} jogos encontrados. Jogos já importados ficam desabilitados.`);
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.error;
      setFeedback(message || 'Não foi possível carregar a biblioteca da Steam.');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleGame(game){
    if(game.imported) return;

    setSelected(current => {
      const next = { ...current };

      if(next[game.appId]){
        delete next[game.appId];
      } else {
        if(Object.keys(next).length >= 20){
          setFeedback('É possível importar até 20 jogos por vez.');
          return current;
        }
        next[game.appId] = 'progress';
      }

      return next;
    });
  }

  function changeStatus(appId, status){
    setSelected(current => ({ ...current, [appId]: status }));
  }

  async function importGames(){
    if(!selectedCount){
      setFeedback('Selecione pelo menos um jogo para importar.');
      return;
    }

    setImporting(true);
    setFeedback('Buscando capas e importando jogos...');

    try {
      const payload = Object.keys(selected).map(appId => ({
        appId: Number(appId),
        status: selected[appId],
      }));
      const response = await api.post('/steam/import', { steamId, games: payload });
      const total = response.data.imported.length;

      if(total){
        history.push('/');
      } else {
        setFeedback('Nenhum jogo novo foi importado.');
      }
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.error;
      setFeedback(message || 'Não foi possível importar os jogos selecionados.');
    } finally {
      setImporting(false);
    }
  }

  return (
    <Container>
      <h1>Importar da Steam</h1>
      <p>A biblioteca precisa estar pública nas configurações de privacidade da Steam.</p>

      <SearchBox>
        <SearchInput
          value={profile}
          onChange={event => setProfile(event.target.value)}
          onKeyDown={event => {
            if(event.key === 'Enter'){
              event.preventDefault();
              loadLibrary();
            }
          }}
          placeholder="SteamID 64 ou link do perfil"
        />
        <Button type="button" onClick={loadLibrary} disabled={loading}>
          {loading ? 'Carregando...' : 'Carregar biblioteca'}
        </Button>
      </SearchBox>

      {feedback && <Feedback>{feedback}</Feedback>}

      {!!games.length && (
        <>
          <Toolbar>
            <FilterInput
              value={filter}
              onChange={event => setFilter(event.target.value)}
              placeholder="Filtrar biblioteca"
            />
            <strong>{selectedCount}/20 selecionados</strong>
          </Toolbar>

          <GamesGrid>
            {visibleGames.map(game => {
              const isSelected = Boolean(selected[game.appId]);
              return (
                <GameCard
                  key={game.appId}
                  selected={isSelected}
                  disabled={game.imported}
                  onClick={() => toggleGame(game)}
                >
                  {game.iconUrl ? (
                    <GameIcon src={game.iconUrl} alt="" />
                  ) : (
                    <GameIcon as="div">Steam</GameIcon>
                  )}
                  <GameInfo>
                    <strong>{game.name}</strong>
                    <span>{formatPlaytime(game.playtimeMinutes)}</span>
                    {game.imported && <em>Já importado</em>}
                    {isSelected && (
                      <StatusSelect
                        value={selected[game.appId]}
                        onClick={event => event.stopPropagation()}
                        onChange={event => changeStatus(game.appId, event.target.value)}
                      >
                        <option value="progress">Em progresso</option>
                        <option value="finished">Zerado</option>
                      </StatusSelect>
                    )}
                  </GameInfo>
                </GameCard>
              );
            })}
          </GamesGrid>

          <Actions>
            <Button type="button" onClick={importGames} disabled={importing || !selectedCount}>
              {importing ? 'Importando...' : `Importar ${selectedCount} jogo(s)`}
            </Button>
          </Actions>
        </>
      )}
    </Container>
  );
}
