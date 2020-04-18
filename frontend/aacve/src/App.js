import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  Redirect,
  Link,
} from 'react-router-dom';
import Login from './Components/Auth/Login';
import Home from './Components/Home';
import Register from './Components/Auth/Register';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';

function App(props) {
  const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  const [currentUser, setCurrentUser] = useState(null);

  const setUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        setAuthTokens: setTokens,
        currentUser,
        setCurrentUser: setUser,
      }}
    >
      <Router>
        <div>
          <Redirect to="/home" />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/home" component={Home} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
