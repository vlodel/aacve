import React, { useState, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

function SearchedList(props) {
  const history = useHistory();

  useEffect(() => {
    history.push('/search=' + props.searchKeywords.split('+'));
  }, []);

  return (
    <IconButton onClick={history.goBack()} aria-label="back" color="primary">
      <ArrowBackIcon />
    </IconButton>
  );
}

export default SearchedList;
