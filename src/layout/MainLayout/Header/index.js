import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Stack } from '@mui/material';

import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';

import { IconMenu2 } from '@tabler/icons';

import { fetchAssessment } from 'global/redux/player/slice';
import { toggleAddEvent, toggleCurrentView } from 'global/redux/assessment/slice';

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(fetchAssessment(''));
    dispatch(toggleCurrentView());
    dispatch(toggleAddEvent());
  }, [dispatch]);

  return (
    <Stack 
      direction='row'
      justifyContent='center'
      alignItems='center'
      sx={{
        width: '100%',
      }}
    >
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto',
          },
        }}
      >
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant='rounded'
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color='inherit'
          >
            <IconMenu2 stroke={1.5} size='1.3rem' />
          </Avatar>
        </ButtonBase>
        <Box
          component='span'
          sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}
          onClick={handleClick}
        >
          <LogoSection />
        </Box>
      </Box>
      {/* header search */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <ProfileSection />
    </Stack>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
