import React, { useState } from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  useHistory,
  Redirect,
} from 'react-router-dom';
import Login from './Components/Auth/Login';
import Home from './Components/Home';
import Register from './Components/Auth/Register';

function App() {
  const [authState, setAuthState] = useState('');

  const handleAuthStateChange = (newValue) => {
    setAuthState(newValue);
  };

  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to="/login" />
        <Route
          path="/login"
          render={(props) => (
            <Login
              {...props}
              authState={authState}
              onAuthStateChange={handleAuthStateChange}
            />
          )}
        />
        {/* <Route
          path="/login"
          component={Login}
          authState={authState}
          onAuthStateChange={handleAuthStateChange}
        /> */}
        <Route path="/register" component={Register} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
