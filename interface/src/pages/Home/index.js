import React, { useState, useEffect } from 'react';
import api from '../../services/api';

import GamesList from '../../components/games_list';

import { Container } from './style';

export default function Home(){
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function loadGames(){
      const response = await api.get('games');

      setGames(response.data);
    }

    loadGames();
  }, []);

  return (
    <Container>
      <GamesList data={games} />
    </Container>
  );
}
