import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  Paper
} from '@mui/material';

import { SAMPLE_INPUT } from 'utils/constant';

const SearchBar = ({setContent}) => {

  const handleChange = (event, value) => {
    if (value !== null) setContent(prev => prev + ' ' + value);
  };

  return (
    <Box
      sx={{
        mt: 3
      }}
    >
      <Autocomplete
        disablePortal
        id='combo-box-demo'
        options={SAMPLE_INPUT}
        fullWidth
        clearOnBlur
        onChange={(event, value) => handleChange(event, value)} 
        PaperComponent={({ children }) => (
          <Paper 
            sx={{
              bgcolor: 'primary.dark',
              color: 'white',
              mb: 2
            }}
          >
            {children}
          </Paper>
        )}
        renderInput={(params) => <TextField {...params} label='Search'/>}
      />
    </Box>
  );
};

SearchBar.propTypes = {
  setContent: PropTypes.func
};

export default SearchBar;