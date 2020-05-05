import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from '../context/auth';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { useHistory } from 'react-router-dom';
import SearchedList from './SearchedList';
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

function Home() {
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { setAuthTokens } = useAuth();
  const [noOfPages, setNoOfPages] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [currentCves, setCurrentCves] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [isSearchDone, setIsSearchDone] = useState(false);
  const [searchedCves, setSearchedCves] = useState([]);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/getNoOfPages`,
    }).then((result) => {
      if (result.status === 200) {
        setNoOfPages(result.data);
      }
    });

    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/getCves/1`,
    }).then((result) => {
      setCurrentCves(result.data);
    });
  }, []);

  const handleLogOut = () => {
    setAuthTokens(null);
  };

  const handlePageChange = async (event, page) => {
    setPageNo(page);

    const result = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/getCves/${page}`,
    });
    history.push(`/dashboard/${page}`);
    setCurrentCves(result.data);
  };

  const [isOpen, setIsOpen] = useState(false);
  const handleCveClick = (id) => {
    setIsOpen({
      ...isOpen,
      [id]: !isOpen[id],
    });
  };

  const displayCurrentCves = () => {
    return (
      <List className={classes.list}>
        {currentCves.map((cve) => (
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
        <Pagination
          count={noOfPages}
          color="primary"
          onChange={handlePageChange}
          style={{ display: 'flex', justifyContent: 'center' }}
        />
      </List>
    );
  };

  const displaySearchedCves = () => {
    return (
      <SearchedList
        searchedCves={searchedCves}
        searchKeywords={searchKeywords}
        setIsSearchDone={setIsSearchDone}
      ></SearchedList>
    );
  };

  const keyPress = (event) => {
    if (event.key == 'Enter') {
      if (searchKeywords.length > 2) {
        setIsSearchDone(true);
        axios({
          method: 'GET',
          url: `${process.env.REACT_APP_API_URL}/getByKeywords`,
          params: {
            keywords: searchKeywords,
          },
        }).then((result) => {
          // return <SearchedList resultCves={result.data} />;
          //setCurrentCves(result.data);
          setSearchedCves(result.data);
        });
      } else {
        alert('Search keywords length must be greater than 2');
      }
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'home-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogOut}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'home-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            AACVE
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              name="searchKeywords"
              value={searchKeywords}
              onChange={(event) => {
                setSearchKeywords(event.target.value);
              }}
              onKeyPress={(event) => {
                keyPress(event);
              }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {isSearchDone ? displaySearchedCves() : displayCurrentCves()}
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default Home;
