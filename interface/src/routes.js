import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import CreateGame from './pages/CreateGame';
import SteamImport from './pages/SteamImport';
import EditGame from './pages/EditGame';
import Stats from './pages/Stats';
import GamePlan from './pages/GamePlan';
import Retrospectives from './pages/Retrospectives';
import Header from './components/Header';

export default function Routes(){
    return (
        <BrowserRouter>
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/newgame" component={CreateGame} />
                <Route path="/games/:id/edit" component={EditGame} />
                <Route path="/stats" component={Stats} />
                <Route path="/game-plan" component={GamePlan} />
                <Route path="/retrospectives" component={Retrospectives} />
                <Route path="/steam/import" component={SteamImport} />
            </Switch>
        </BrowserRouter>
    );
}
