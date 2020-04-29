import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Home from './Components/Home';
import Register from './Components/Auth/Register';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';

function App() {
  const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  const existingUser = JSON.parse(localStorage.getItem('user'));
  const [currentUser, setCurrentUser] = useState(existingUser);

  const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
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
