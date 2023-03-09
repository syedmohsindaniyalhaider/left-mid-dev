import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Toolbar,
  Stack,
  Typography
} from '@mui/material';

import Header from './Header';
import Sidebar from './Sidebar';
import { drawerWidth } from 'utils/constant';
import { IconChevronRight } from '@tabler/icons';
import navigation from './Sidebar/menu-items/index';
import Breadcrumbs from 'components/Extended/Breadcrumbs';
import { SET_MENU } from 'global/redux/customization/actions';

import useAuth from 'hooks/useAuth';
import { getUserInfo, getPlayerList } from 'global/redux/auth/thunk';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up('md')]: {
        marginLeft: -(drawerWidth - 20),
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down('md')]: {
        marginLeft: '20px',
        width: `calc(100% - ${drawerWidth}px)`,
        padding: '16px',
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: '10px',
        width: `calc(100% - ${drawerWidth}px)`,
        padding: '16px',
        marginRight: '10px',
      },
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      [theme.breakpoints.down('md')]: {
        marginLeft: '20px',
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: '10px',
      },
    }),
  })
);

const MainLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useAuth();
  const dispatch = useDispatch();
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const { fetchData, isLogin } = useSelector(({auth}) => ({
    fetchData: auth.fetchData,
    isLogin: auth.isLogin
  }));
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  useEffect(() => {
    if (localStorage.getItem('isLogin') !== 'true') {
      navigate('/login');
    }
  });

  useEffect(() => {
    if(user?.uid && !fetchData && isLogin) {
      dispatch(getUserInfo(user?.uid));
      dispatch(getPlayerList(user?.uid));
    }
  }, [user?.uid, dispatch, fetchData, isLogin]);

  return (
    <>
      <Box
        sx={{
          display: {
            md: 'flex',
            lg: 'none'
          },
          width: '100vw',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography variant='h3'>
					Please use devices with bigger screen, ideally 1024px up, thank you
        </Typography>
      </Box>
      <Box 
        sx={{           
          display: {
            md: 'none',
            lg: 'flex'
          }, 
        }}
      >
        <CssBaseline />
        {/* header */}
        <Stack
          sx={{
            position: 'fixed',
            zIndex: 3,
            width: '100%',
            height: 90,
            bgcolor: theme.palette.background.default,
            padding: 0,
            transition: leftDrawerOpened
              ? theme.transitions.create('width')
              : 'none',
          }}
        >
          <Toolbar>
            <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
          </Toolbar>
        </Stack>
        {/* drawer */}
        <Sidebar
          drawerOpen={leftDrawerOpened}
          drawerToggle={handleLeftDrawerToggle}
        />

        {/* main content */}
        <Main theme={theme} open={leftDrawerOpened}>
          {/* breadcrumb */}
          <Breadcrumbs
            separator={IconChevronRight}
            navigation={navigation}
            icon
            title
            rightAlign
          />
          <Outlet />
        </Main>
      </Box>
    </>
  );
};

export default MainLayout;
