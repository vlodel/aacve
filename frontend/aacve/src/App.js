import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Home from './Components/Dashboard/Home';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/dashboard/home" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
