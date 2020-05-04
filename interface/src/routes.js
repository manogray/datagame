import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import CreateGame from './pages/CreateGame';

export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/newgame" component={CreateGame} />
            </Switch>
        </BrowserRouter>
    );
}