import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Redirect } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import {
  CssBaseline,
  Typography,
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Link,
  Grid,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const classes = useStyles();

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthTokens } = useAuth();

  const history = useHistory();

  //TODO: check if

  const handleLoginClick = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        email: email,
        password: password,
      })
      .then((result) => {
        if (result.status === 200) {
          console.log(result.data);
          setAuthTokens(result.data.accessToken);
          setLoggedIn(true);
        } else {
          setIsError(true);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setIsError(true);
      });
  };

  if (isLoggedIn) {
    return <Redirect to="/home" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => handleLoginClick()}
          >
            Login
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link
                to="/register"
                variant="body1"
                onClick={() => history.push('/register')}
              >
                No account? Reigster
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Login;
