import React, { Component } from 'react';

import { List, Game, Status } from './style';

export default class GamesList extends Component {
  render() {
    return (
        <List>
            <Game>
                <span>Batman</span>
                <Status status="finished">Zerado</Status>
            </Game>
        </List>
    );
  }
}
