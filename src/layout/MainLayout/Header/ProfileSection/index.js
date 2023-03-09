import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';

import MainCard from 'components/Cards';
import { logout } from 'global/redux/auth/thunk';
import { reset } from 'global/redux/assessment/slice';
import Transitions from 'components/Extended/Transitions';
import { resetDraft } from 'global/redux/player/slice';

import { IconLogout, IconSettings } from '@tabler/icons';

const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  const [open, setOpen] = useState(false);
  const userInfo = useSelector(({auth}) => auth.userInfo);
  const anchorRef = useRef(null);

  const handleLogout = async () => {
    const isLogout = await dispatch(logout());
    if (isLogout) {
      dispatch(reset());
      dispatch(resetDraft());
      localStorage.removeItem('teamId');
      localStorage.removeItem('isLogin');
      navigate('/login');
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction='row' justifyContent='center' alignItems='center' gap={5}>
      <Chip
        sx={{
          height: '50px',
          alignItems: 'center',
          borderRadius: '20px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={userInfo?.profilePhoto}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup='true'
            color='inherit'
          />
        }
        label={<IconSettings stroke={1.5} size='1.5rem' color={theme.palette.primary.main} />}
        variant='outlined'
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
        color='primary'
      />
      <Popper
        placement='bottom-end'
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={10} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction='row' spacing={0.5} alignItems='center'>
                        <Typography variant='h4'>Welcome,</Typography>
                        <Typography component='span' variant='h4' sx={{ fontWeight: 400 }}>
                          {`${userInfo.firstName} ${userInfo.lastName}`}
                        </Typography>
                      </Stack>
                      <Typography variant='subtitle2'>
                        {`${userInfo.displayName}`}
                      </Typography>
                    </Stack>
                  </Box>
                  <Divider/>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <List
                      component='nav'
                      sx={{
                        width: '100%',
                        maxWidth: 400,
                        minWidth: 350,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '10px',
                        [theme.breakpoints.down('md')]: {
                          minWidth: '100%'
                        },
                        '& .MuiListItemButton-root': {
                          mt: 0.5
                        }
                      }}
                    >
                      <ListItemButton
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        onClick={handleLogout}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size='1.3rem' />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant='body2'>Logout</Typography>} />
                      </ListItemButton>
                    </List>
                  </Box>
                  {/*</PerfectScrollbar>*/}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Stack>
  );
};

export default ProfileSection;
