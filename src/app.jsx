import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import { Home } from 'pages/Home/Home';
import { Puzzle } from 'pages/Puzzle/Puzzle';


export class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route path="/home" component={Home} />
          <Route path="/puzzle" component={Puzzle} />
        </div>
      </HashRouter>
    );
  }
}
