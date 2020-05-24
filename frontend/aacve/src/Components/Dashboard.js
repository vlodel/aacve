import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router-dom';
import SearchedList from './SearchedList';
import DefaultList from './DefaultList';
import Statistics from './Statistics';

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

function Dashboard(props) {
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { setAuthTokens } = useAuth();
  const { setCurrentUser } = useAuth();

  const [searchKeywords, setSearchKeywords] = useState('');
  const [isSearchDone, setIsSearchDone] = useState(false);
  const [searchedCves, setSearchedCves] = useState([]);
  const [isStatisticsButtonPressed, setIsStatisticsButtonPressed] = useState(
    false
  );

  const [renderedComponent, setRenderedComponent] = useState('defaultList');

  const handleLogOut = () => {
    setAuthTokens(null);
    setCurrentUser(null);
  };

  const displayCurrentCves = () => {
    return <DefaultList></DefaultList>;
  };

  const displaySearchedCves = () => {
    return (
      <SearchedList
        searchedCves={searchedCves}
        searchKeywords={searchKeywords}
        setRenderedComponent={setRenderedComponent}
      ></SearchedList>
    );
  };

  const displayStatisticsModule = () => {
    return (
      <Statistics setRenderedComponent={setRenderedComponent}></Statistics>
    );
  };

  const keyPress = (event) => {
    if (event.key == 'Enter') {
      if (searchKeywords.length > 2) {
        setRenderedComponent('searchedList');
        axios({
          method: 'GET',
          url: `${process.env.REACT_APP_API_URL}/getByKeywords`,
          params: {
            keywords: searchKeywords,
          },
        }).then((result) => {
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
      <AppBar position="sticky">
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton> */}
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
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => {
              setRenderedComponent('statistics');
            }}
          >
            <EqualizerIcon />
            <Typography className={classes.title} variant="h6" noWrap>
              Statistics
            </Typography>
          </IconButton>
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
              <Typography className={classes.title} noWrap>
                {console.log(props.currentUser)}
              </Typography>
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
      <div>
        {(() => {
          switch (renderedComponent) {
            case 'defaultList':
              return displayCurrentCves();
            case 'searchedList':
              return displaySearchedCves();
            case 'statistics':
              return displayStatisticsModule();
          }
        })()}
      </div>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default Dashboard;
