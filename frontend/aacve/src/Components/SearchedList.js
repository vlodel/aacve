import React, { useState, useEffect } from 'react';
import { IconButton, List } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { fade, makeStyles } from '@material-ui/core/styles';
import Cve from './Cve';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  list: {
    margin: theme.spacing(3),
  },
}));

function SearchedList(props) {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={classes.grow}>
      <IconButton
        onClick={() => {
          props.setRenderedComponent('defaultList');
        }}
        aria-label="back"
        color="primary"
      >
        <ArrowBackIcon />
      </IconButton>
      <List className={classes.list}>
        {props.searchedCves.map((cve) => (
          <Cve
            key={cve.id}
            cve={cve}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
          ></Cve>
        ))}
      </List>
    </div>
  );
}

export default SearchedList;
