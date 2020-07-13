import React, { useState } from 'react';
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
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

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
  button: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Login(props) {
  const classes = useStyles();

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthTokens } = useAuth();
  const { setCurrentUser } = useAuth();
  const history = useHistory();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleLoginClick = () => {
    if (email.length != 0 && password.length != 0) {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_URL}/login`,
        data: {
          email: email,
          password: password,
        },
      })
        .then((result) => {
          if (result.status === 200) {
            console.log(result.data);
            setIsError(false);
            setAuthTokens(result.data.accessToken);
            setLoggedIn(true);
            setCurrentUser({
              email: result.data.email,
              firstName: result.data.firstName,
              lastName: result.data.lastName,
            });
          }
        })
        .catch((err) => {
          if (err.message.includes('404')) {
            setIsError(true);
          }
        });
    } else {
      setIsAlertOpen(true);
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/dashboard" />;
  }

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsAlertOpen(false);
  };

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsError(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form}>
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
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="button"
            onClick={() => {
              handleLoginClick();
            }}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.button}
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
      <div>
        <Snackbar
          open={isAlertOpen}
          autoHideDuration={4000}
          onClose={handleAlertClose}
        >
          <Alert onClose={handleAlertClose} severity="error">
            Please fill in all the fields!
          </Alert>
        </Snackbar>
        <Snackbar
          open={isError}
          autoHideDuration={4000}
          onClose={handleErrorClose}
        >
          <Alert onClose={handleErrorClose} severity="error">
            Invalid email and password!
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
}

export default Login;
