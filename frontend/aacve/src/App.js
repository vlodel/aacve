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
  // const [authState, setAuthState] = useState(null);

  // const handleAuthStateChange = (newValue) => {
  //   setAuthState(newValue);
  // };

  // return (
  //   <Router>
  //     <Switch>
  //       <Redirect exact from="/" to={authState ? '/home' : '/login'} />
  //       <Route
  //         path="/login"
  //         render={(props) => (
  //           <Login
  //             {...props}
  //             authState={authState}
  //             onAuthStateChange={handleAuthStateChange}
  //           />
  //         )}
  //       />
  //       <Route path="/register" component={Register} />
  //       <Route path="/home" component={Home} />
  //     </Switch>
  //   </Router>
  // );

  const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <div>
          {/* <ul>
            <li>
              <Link to="/home">Home Page</Link>
            </li>
          </ul> */}
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
