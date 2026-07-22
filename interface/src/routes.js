import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import CreateGame from './pages/CreateGame';
import SteamImport from './pages/SteamImport';
import Header from './components/Header';

export default function Routes(){
    return (
        <BrowserRouter>
            <Header />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/newgame" component={CreateGame} />
                <Route path="/steam/import" component={SteamImport} />
            </Switch>
        </BrowserRouter>
    );
}
