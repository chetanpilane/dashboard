// src/components/Login.js
// src/components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { TextField, Button, Container, Typography } from '@mui/material';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField 
        label="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        fullWidth 
        margin="normal" 
      />
      <TextField 
        label="Password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        fullWidth 
        margin="normal" 
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleLogin}
        style={{ marginTop: '20px' }}
      >
        Login
      </Button>
    </Container>
  );
};

export default Login;
