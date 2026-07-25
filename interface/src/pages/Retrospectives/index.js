import React, { useEffect, useState } from 'react';

import GamesList from '../../components/games_list';
import api from '../../services/api';

import { Container, PageHeader, YearInput, EmptyState } from './style';

export default function Retrospectives(){
  const [games, setGames] = useState([]);
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function loadGames(){
      try {
        const response = await api.get('/games');
        setGames(response.data);
      } catch (error) {
        setLoadError('Não foi possível carregar os jogos.');
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  function handleYearChange(event){
    setYear(event.target.value.replace(/\D/g, ''));
  }

  const retrospectiveGames = year
    ? games.filter(game => (
      game.status === 'finished'
      && String(game.year) === year
    ))
    : [];

  return (
    <Container>
      <PageHeader>
        <h1>Retrospectivas</h1>
        <label htmlFor="retrospective-year">Informe o ano</label>
        <YearInput
          id="retrospective-year"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={year}
          onChange={handleYearChange}
          placeholder="Ex.: 2025"
          autoComplete="off"
          aria-label="Ano da retrospectiva"
        />
      </PageHeader>

      {loadError && <EmptyState>{loadError}</EmptyState>}
      {year && !loading && !loadError && !retrospectiveGames.length && (
        <EmptyState>Nenhum jogo zerado em {year}.</EmptyState>
      )}
      {!!retrospectiveGames.length && <GamesList data={retrospectiveGames} />}
    </Container>
  );
}
