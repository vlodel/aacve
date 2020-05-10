import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Dashboard from './Components/Dashboard';
import Register from './Components/Auth/Register';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';
import axios from 'axios';

function App() {
  useEffect(() => {
    // axios.interceptors.response.use(
    //   (res) => {
    //     Promise.resolve(res.data);
    //   },
    //   (error) => {
    //     localStorage.removeItem('tokens');
    //     localStorage.removeItem('user');
    //     setAuthTokens(null);
    //     setCurrentUser(null);
    //   }
    // );

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/verifyToken`,
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${authTokens}`,
      },
    })
      .then((result) => {
        console.log(result);
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
          <Redirect to="/dashboard" />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
