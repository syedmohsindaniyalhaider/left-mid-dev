// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';

import AnimateButton from 'components/Extended/AnimateButton';
import { resetPassword } from 'global/redux/auth/request';
import { showNoti } from 'utils/helper';

const FirebaseRegister = ({ ...others }) => {
  const theme = useTheme();

  const handleSubmit = async (data, { setErrors, setStatus, setSubmitting }) => {
    try {
      const res = await resetPassword(data.email);
      if (res) {
        showNoti('success', 'Password reset link sent');
      }
    } catch(err) {
      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Grid container direction='column' justifyContent='center' spacing={2}>
        <Grid item xs={12} container alignItems='center' justifyContent='center'>
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle1'>Enter Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: 'test17@leftmid.com',
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        })}
        onSubmit={
          (values, {setErrors, setStatus, setSubmitting}) => 
            handleSubmit(values, {setErrors, setStatus, setSubmitting})}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} 
              sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor='outlined-adornment-email-register'>Email Address </InputLabel>
              <OutlinedInput
                id='outlined-adornment-email-register'
                type='email'
                value={values.email}
                name='email'
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id='standard-weight-helper-text--register'>
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

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
                  Send Reset Mail
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseRegister;