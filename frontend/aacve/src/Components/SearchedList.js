import React, { useState, useEffect } from 'react';
import { IconButton, List } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { fade, makeStyles } from '@material-ui/core/styles';
import Cve from './Cve';

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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
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
          props.setIsSearchDone(false);
        }}
        aria-label="back"
        color="primary"
      >
        <ArrowBackIcon />
      </IconButton>
      <List className={classes.list}>
        {props.searchedCves.map((cve) => (
          <Cve cve={cve} setIsOpen={setIsOpen} isOpen={isOpen}></Cve>
        ))}
      </List>
    </div>
  );
}

export default SearchedList;
