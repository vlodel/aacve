import React, { useState } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Typography,
  TextField,
  Grid,
  InputBase,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import Button from '@material-ui/core/Button';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import enLocale from 'date-fns/locale/en-GB';
import { LocalizationProvider, DatePicker } from '@material-ui/pickers';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  picker: {
    margin: theme.spacing(1, 1, 1, 1),
  },
}));

//Modul: Analiza pe search | ex: caut facebook, google, instagram si primesc statistici despre fiecare dintr-un anumit an, etc.
function Statistics(props) {
  const classes = useStyles();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [inputs, setInputs] = useState(['']);

  const handleChangeInput = (index, event) => {
    const values = [...inputs];
    const filter = event.target.value;
    values[index] = filter;
    setInputs(values);
    console.log(inputs);
  };

  const handleRemoveInput = (index) => {
    const values = [...inputs];
    if (values.length > 1) {
      values.splice(index, 1);
    }
    setInputs(values);
  };

  const handleAddInput = () => {
    const values = [...inputs];
    values.push('');
    setInputs(values);
  };

  const handleClickAnalyse = () => {
    const result = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/analysisSearch`,
      data: {
        filters:inputs
      },
    });
  };

  return (
    <div>
      <IconButton
        onClick={() => {
          props.setRenderedComponent('defaultList');
        }}
        aria-label="back"
        color="primary"
      >
        <ArrowBackIcon />
      </IconButton>
      {/* <Typography variant="h5">Statistics</Typography> */}
      <div className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >
          <LocalizationProvider dateAdapter={DateFnsAdapter} locale={enLocale}>
            <Grid item className={classes.picker}>
              <DatePicker
                disableFuture
                renderInput={(props) => <TextField {...props} />}
                label="Start date"
                openTo="year"
                views={['year', 'month', 'date']}
                value={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </Grid>
            <Grid item className={classes.picker}>
              <DatePicker
                disableFuture
                renderInput={(props) => <TextField {...props} />}
                label="End date"
                openTo="year"
                views={['year', 'month', 'date']}
                value={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </Grid>
          </LocalizationProvider>
        </Grid>
        {inputs.map((filter, index) => (
          <div key={index}>
            <TextField
              variant="outlined"
              id={filter + '-filter'}
              label="Filter"
              name={filter + '-filter'}
              size="small"
              className="filter"
              placeholder="Enter Filter"
              value={filter}
              onChange={(event) => handleChangeInput(index, event)}
            />
            <IconButton
              onClick={() => {
                handleAddInput();
              }}
              aria-label="back"
              color="primary"
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                handleRemoveInput(index);
              }}
              aria-label="back"
              color="primary"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ShowChartIcon />}
        >
          Analyse
        </Button>
      </div>
    </div>
  );
}

export default Statistics;
