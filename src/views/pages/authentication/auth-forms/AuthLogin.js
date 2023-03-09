import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from 'global/redux/auth/thunk';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';

import AnimateButton from 'components/Extended/AnimateButton';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (data, { setErrors, setStatus, setSubmitting }) => {
    try {
      setStatus({success: true});
      setSubmitting(true);
      const res = await dispatch(login(data));
      if (res?.payload?.status) {
        localStorage.setItem('isLogin', 'true');
        navigate('/dashboard/assessment');
      } else {
        setErrors({ submit: res.payload });
      }
    } catch(err) {
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('isLogin') === 'true') {
      navigate('/dashboard/assessment');
    }
  }, [navigate]);

  return (
    <>
      <Grid container direction='column' justifyContent='center' spacing={2}>
        <Grid item xs={12} container alignItems='center' justifyContent='center'>
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle1'>Sign in with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email:	'', 
          password: '',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={
          (values, {setErrors, setStatus, setSubmitting}) => 
            handleSubmit(values, {setErrors, setStatus, setSubmitting})}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl 
              fullWidth 
              error={Boolean(touched.email && errors.email)} 
              sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor='outlined-adornment-email-login'>Email Address / Username</InputLabel>
              <OutlinedInput
                id='outlined-adornment-email-login'
                type='email'
                value={values.email}
                name='email'
                onBlur={handleBlur}
                onChange={handleChange}
                label='Email Address / Username'
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id='standard-weight-helper-text-email-login'>
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor='outlined-adornment-password-login'>Password</InputLabel>
              <OutlinedInput
                id='outlined-adornment-password-login'
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name='password'
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                      size='large'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label='Password'
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id='standard-weight-helper-text-password-login'>
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction='row' alignItems='center' justifyContent='flex-end' m={1}>
              <Typography
                component={Link}
                to='/reset-password'
                variant='subtitle1'
                color='secondary'
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                Forgot Password ?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  color='secondary'
                >
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
