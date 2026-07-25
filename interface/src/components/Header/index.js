import React from 'react';
import { NavLink } from 'react-router-dom';

import { Container, Content, Brand, Navigation } from './style';

export default function Header(){
  return (
    <Container>
      <Content>
        <Brand to="/">DATAGAME</Brand>

        <Navigation aria-label="Navegação principal">
          <NavLink to="/newgame" activeClassName="active">
            Adicionar jogo
          </NavLink>
          <NavLink to="/steam/import" activeClassName="active">
            Importar da Steam
          </NavLink>
          <NavLink to="/stats" activeClassName="active">
            Estatísticas
          </NavLink>
          <NavLink to="/game-plan" activeClassName="active">
            Plano de jogo
          </NavLink>
          <NavLink to="/retrospectives" activeClassName="active">
            Retrospectivas
          </NavLink>
        </Navigation>
      </Content>
    </Container>
  );
}
