import React, { useState, useEffect } from 'react';

import { ToastContainer } from 'react-toastify';

import { showNoti } from 'utils/helper';

import 'react-toastify/dist/ReactToastify.css';

const InternetCheck = ({ children }) => {
  const [firstRendered, setFirstRendered] = useState(false);

  useEffect(() => {
    setFirstRendered(true);
    const notifyChange = () => {
      if (navigator.onLine) {
        showNoti(
          'success',
          'Your internet connection was restored',
          'bottom-left'
        );
      } else {
        showNoti('error', 'You are currently offline', 'bottom-left');
      }
    };
    window.addEventListener('online', notifyChange);
    window.addEventListener('offline', notifyChange);
    return () => {
      window.removeEventListener('online', notifyChange);
      window.removeEventListener('offline', notifyChange);
    };
  }, []);

  return (
    <>
      {firstRendered && (
        <div className='internet-check'>
          <ToastContainer
            enableMultiContainer
            containerId={'bottom-left'}
            autoClose={5000}
            closeButton={true}
            position='bottom-left'
            theme='dark'
            hideProgressBar
          />
          {children}
        </div>
      )}
    </>
  );
};

export default InternetCheck;
