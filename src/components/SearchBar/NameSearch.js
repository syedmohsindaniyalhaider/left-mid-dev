import React, { useCallback } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const NameSearch = ({searchContent, setSearchContent}) => {

  const handleChange = useCallback((e) => {
    setSearchContent(e.target.value);
  }, [setSearchContent]);

  return (
    <TextField
      id='outlined-textarea'
      label='Search'
      placeholder='Enter name'
      value={searchContent}
      onChange={handleChange}
      sx={{width: 350}}
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

export default NameSearch;