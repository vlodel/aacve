import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch, HashRouter } from 'react-router-dom';
import axios from 'axios';

//components
import Layout from './components//Layout/Layout';

//context
import { useUserState } from './context/UserContext';

//pages
import Login from './pages/login/Login';
import Error from './pages/error/Error';

export default function App() {
  // useEffect(() => {
  //   axios({
  //     method: 'POST',
  //     url: `${process.env.REACT_APP_API_URL}/verifyToken`,
  //     headers: {
  //       Accept: 'application/json',
  //       authorization: `Bearer ${authTokens}`,
  //     },
  //   })
  //     .then((result) => {
  //       if (result.status === 401) {
  //         localStorage.removeItem('tokens');
  //         localStorage.removeItem('user');
  //         setAuthTokens(null);
  //         setCurrentUser(null);
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.message.includes('401')) {
  //         localStorage.removeItem('tokens');
  //         localStorage.removeItem('user');
  //         setAuthTokens();
  //         setCurrentUser();
  //       }
  //     });
  // }, []);

  // const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  // const [authTokens, setAuthTokens] = useState(existingTokens);
  // const existingUser = JSON.parse(localStorage.getItem('user'));
  // const [currentUser, setCurrentUser] = useState(existingUser);
  // const [analyzerResults, setAnalyzerResults] = useState(null);

  // const setTokens = (data) => {
  //   localStorage.setItem('tokens', JSON.stringify(data));
  //   setAuthTokens(data);
  // };

  // const setUser = (user) => {
  //   localStorage.setItem('user', JSON.stringify(user));
  //   setCurrentUser(user);
  // };

  // const setResults = (results) => {
  //   setAnalyzerResults(results);
  // };

  const { isAuthenticated } = useUserState();

  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
        <Route exact path="/app" render={() => <Redirect to="/app/dashboard" />} />
        <PrivateRoute path="/app" component={Layout} />
        <PublicRoute path="/login" component={Login} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
