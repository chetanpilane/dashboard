
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import BookTable from './dashboard';
import Login from './login';
import { CircularProgress, Container } from '@mui/material';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      {user ? <BookTable /> : <Login setUser={setUser} />}
    </Container>
  );
};

export default App;
