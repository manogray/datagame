import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import GamesList from '../../components/games_list';
import Button from '../../components/button';

import { Container } from './style';

export default function Home(){
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function loadGames(){
      const response = await api.get('games');

      setGames(response.data);
      console.log(response.data);
    }

    loadGames();
  }, []);

  return (
    <Container>
      <h1>Seus Jogos</h1>

      <GamesList data={games} />

      <Link to="newgame">
        <Button>Adicionar Jogo</Button>
      </Link>
    </Container>
  );
}