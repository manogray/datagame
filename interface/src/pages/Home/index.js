import React, { Component } from 'react';
import GamesList from '../../components/games_list';
import Button from '../../components/button';

// import { Container } from './styles';

export default class Home extends Component {
  render() {
    return (
      <>
        <h1>Seus Jogos</h1>

        <GamesList />

        <Button>Adicionar Jogo</Button>
      </>
    );
  }
}