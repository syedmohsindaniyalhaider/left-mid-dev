import React from 'react';
import {
  Box,
  CircularProgress
} from '@mui/material';

const Loading = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
      }}
    >
      <CircularProgress/>
    </Box>
  );
};

export default Loading;