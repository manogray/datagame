import React, { useState, useEffect } from 'react';
import api from '../../services/api';

import GamesList from '../../components/games_list';
import Button from '../../components/button';
import { steamProfileStorageKey } from '../../constants/storage';

import { Container, PageHeader, SyncFeedback, AlphabetFilter, LetterButton, ClearFilter } from './style';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function firstLetter(name){
  return String(name || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .charAt(0)
    .toUpperCase();
}

export default function Home(){
  const [games, setGames] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');

  useEffect(() => {
    async function loadGames(){
      const response = await api.get('games');

      setGames(response.data);
    }

    loadGames();
  }, []);

  async function syncSteam(){
    let profile = '';
    try {
      profile = window.localStorage.getItem(steamProfileStorageKey) || '';
    } catch (error) {
      profile = '';
    }

    if(!profile){
      setSyncFeedback('Carregue uma biblioteca na página Importar da Steam antes de sincronizar.');
      return;
    }

    setSyncing(true);
    setSyncFeedback('Sincronizando sua biblioteca Steam...');

    try {
      const response = await api.post('/steam/sync', { profile });
      const gamesResponse = await api.get('games');
      setGames(gamesResponse.data);

      const { updated, notFound } = response.data;
      setSyncFeedback(
        `${updated} ${updated === 1 ? 'jogo atualizado' : 'jogos atualizados'}`
        + (notFound ? `. ${notFound} ${notFound === 1 ? 'jogo não foi encontrado' : 'jogos não foram encontrados'} na biblioteca.` : '.')
      );
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.error;
      setSyncFeedback(message || 'Não foi possível sincronizar a biblioteca Steam.');
    } finally {
      setSyncing(false);
    }
  }

  const filteredGames = selectedLetter
    ? games.filter(game => firstLetter(game.name) === selectedLetter)
    : games;

  return (
    <Container>
      <PageHeader>
        <h1>Seus Jogos</h1>
        <Button type="button" onClick={syncSteam} disabled={syncing}>
          {syncing ? 'Sincronizando...' : 'Sincronizar Steam'}
        </Button>
      </PageHeader>
      {syncFeedback && <SyncFeedback>{syncFeedback}</SyncFeedback>}
      <AlphabetFilter aria-label="Filtrar jogos pela letra inicial">
        {alphabet.map(letter => (
          <LetterButton
            key={letter}
            type="button"
            aria-pressed={selectedLetter === letter}
            onClick={() => setSelectedLetter(letter)}
          >
            {letter}
          </LetterButton>
        ))}
        <ClearFilter type="button" onClick={() => setSelectedLetter('')} disabled={!selectedLetter}>
          Limpar filtro
        </ClearFilter>
      </AlphabetFilter>
      <GamesList data={filteredGames} />
    </Container>
  );
}
