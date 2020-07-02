import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Grid, Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { DropzoneArea } from 'material-ui-dropzone';
import axios from 'axios';
import ResponsivePieChart from './Charts/ResponsivePieChart';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  dropzone: {
    width: '60vw',
  },
  button: {
    marginTop: 8,
  },
}));

function FileAnalyzer(props) {
  const classes = useStyles();
  const filesLimit = 1;
  const maxFileSize = 10000000;

  const [currentFile, setCurrentFile] = useState();
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState();

  const handleFileUpload = async () => {
    setShowChart(false);
    const formData = new FormData();
    formData.append('document', currentFile[0]);

    const result = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      url: `${process.env.REACT_APP_API_URL}/fileUpload`,
      data: formData,
    });

    console.log(result.data);
    setChartData(result.data);
    setShowChart(true);
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

      <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="center"
      >
        <Grid item>
          <div className={classes.dropzone}>
            <DropzoneArea
              acceptedFiles={['.docx']}
              maxFileSize={maxFileSize}
              dropzoneText={'Click or drag & drop your file here'}
              filesLimit={filesLimit}
              onChange={(file) => setCurrentFile(file)}
            />
          </div>
        </Grid>
        <Grid item>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShowChartIcon />}
            onClick={() => {
              handleFileUpload();
            }}
          >
            Analyse
          </Button>
        </Grid>
      </Grid>
      {showChart ? (
        <ResponsivePieChart data={chartData}></ResponsivePieChart>
      ) : null}
    </div>
  );
}

export default FileAnalyzer;
