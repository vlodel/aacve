import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Dashboard from './Components/Dashboard';
import Register from './Components/Auth/Register';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './AppContext/auth';
import { AnalyzerContext } from './AppContext/analyzerResults';
import axios from 'axios';
import Statistics from './Components/Statistics';
import {
  MuiThemeProvider,
  createMuiTheme,
  CssBaseline,
} from '@material-ui/core';

function App() {
  useEffect(() => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/verifyToken`,
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${authTokens}`,
      },
    })
      .then((result) => {
        if (result.status === 401) {
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
          setAuthTokens(null);
          setCurrentUser(null);
        }
      })
      .catch((err) => {
        if (err.message.includes('401')) {
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
          setAuthTokens();
          setCurrentUser();
        }
      });
  }, []);

  const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const existingUser = JSON.parse(localStorage.getItem('user'));
  const [currentUser, setCurrentUser] = useState(existingUser);
  const [analyzerResults, setAnalyzerResults] = useState(null);

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const setResults = (results) => {
    setAnalyzerResults(results);
  };

  const theme = createMuiTheme({
    palette: {
      background: {
        default: '#2e2e2e',
      },
      primary: {
        main: '#c9a95e',
      },
      secondary: {
        main: '#ffffff',
      },
    },
    overrides: {
      MuiPaginationItem: {
        root: {
          color: '#ffffff',
        },
      },
      MuiListItem: {
        root: {
          color: '#ffffff',
        },
      },
    },
  });

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        setAuthTokens: setTokens,
        currentUser,
        setCurrentUser: setUser,
      }}
    >
      <AnalyzerContext.Provider
        value={{
          analyzerResults,
          setAnalyzerResults: setResults,
        }}
      >
        <Router>
          <div>
            <Redirect to="/dashboard" />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/statistics" component={Statistics} />
          </div>
        </Router>
      </AnalyzerContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
