import React, { useCallback } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const EventSearch = ({searchContent, setSearchContent}) => {

  const handleChange = useCallback((e) => {
    setSearchContent(e.target.value);
  }, [setSearchContent]);

  return (
    <TextField
      id='outlined-textarea'
      label='Search'
      placeholder='Enter event'
      value={searchContent}
      onChange={handleChange}
      sx={{width: 300}}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default EventSearch;