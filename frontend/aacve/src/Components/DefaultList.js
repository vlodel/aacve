import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { List } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Cve from './Cve';

const useStyles = makeStyles((theme) => ({
  list: {
    margin: theme.spacing(3),
    height: '90vh',
  },
}));

function DefaultList() {
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

  const classes = useStyles();
  const history = useHistory();
  const [noOfPages, setNoOfPages] = useState(1);
  const [currentCves, setCurrentCves] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const handlePageChange = async (event, page) => {
    setPageNo(page);

    const result = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_URL}/getCves/${page}`,
    });
    history.push(`/dashboard/${page}`);
    setCurrentCves(result.data);
  };

  return (
    <List className={classes.list}>
      {currentCves.map((cve) => (
        <Cve key={cve.id} cve={cve} setIsOpen={setIsOpen} isOpen={isOpen}></Cve>
      ))}
      <Pagination
        count={noOfPages}
        color="primary"
        onChange={handlePageChange}
        style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        size="small"
      />
    </List>
  );
}

export default DefaultList;
