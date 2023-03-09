import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { firebaseAuth } from 'services';

const useAuth = () => {
  const [ user, setUser ] = useState();

  useEffect( () => {
    onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
    });
  }, []);

  return user;
};

export default useAuth;