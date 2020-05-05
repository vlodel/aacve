import React, { useState, useEffect } from 'react';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

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
  const handleCveClick = (id) => {
    setIsOpen({
      ...isOpen,
      [id]: !isOpen[id],
    });
  };

  const [currentCves, setCurrentCves] = useState([]);

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
          <div>
            <ListItem
              key={cve.id}
              button
              onClick={() => {
                handleCveClick(cve.id);
              }}
            >
              <ListItemText
                primary={cve.id}
                style={{ display: 'flex', justifyContent: 'center' }}
              ></ListItemText>
              {isOpen[cve.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={isOpen[cve.id]} timeout="auto" unmountOnExit>
              <ListItem>
                <ListItemText
                  primary={cve.description.description_data[0].value}
                ></ListItemText>
              </ListItem>
            </Collapse>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}

export default SearchedList;
