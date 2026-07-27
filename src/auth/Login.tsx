// import {ChangeEvent, MouseEventHandler, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import {
    Box,
    Button,
    Card,
    CardContent,
    CssBaseline,
    TextField,
    Typography
} from '@mui/material';
import AppTheme from '../shared-theme/AppTheme';
import { ChangeEvent, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './AuthContext';


interface ILoginData {
    email: string | undefined;
    password: string | undefined;
}

export default function Login() {
    const [loginEmail, setLoginEmail] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');

    const location = useLocation();
    const navigate = useNavigate();
    const { login: setAuthToken } = useAuth();

    useEffect(() => {
        const emailFromState = (location.state as { email?: string } | null)?.email ?? '';
        setLoginEmail(emailFromState);
    }, [location.state]);

    const handleLoginEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginEmail(e.target.value);
    }

    const handleLoginPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginPassword(e.target.value);
    }


    const login = () => {
        loginRequest.mutate({
            email: loginEmail,
            password: loginPassword,
        });
    };

    const loginRequest = useMutation({
    mutationFn: async (loginData: ILoginData) => {
        const response = await fetch(
        ' https://localhost:7122/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginData)
        }
      )
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    },
    onSuccess: (response) => {
      const accessToken = typeof response === 'string'
        ? response
        : response?.accessToken ?? '';

      if (accessToken) {
        setAuthToken(accessToken);
      }

      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Error registering user:', error);
    },
  });

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Box sx={{
                height: '15vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Typography variant="h4" component="div">
                    Welcome to SeshBuilder and Pose Database
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                width: '100vw',
            }}>
                <Card sx={{ 
                    display: 'flex',
                    justifyContent: 'space-around',
                    minWidth: '390px',
                    height: '32vh',
                }}>
                    <CardContent sx={{ 
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <Typography variant="h5" component="div" sx={{alignSelf: 'flex-start'}}>
                            Log In
                        </Typography>
                        <TextField required id="registration-email" value={loginEmail} label="Email" variant="outlined" onChange={handleLoginEmailChange}/>
                        <TextField required id="registration-password" value={loginPassword} label="Password" variant="outlined" onChange={handleLoginPasswordChange} />
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row', 
                            justifyContent: 'flex-end',
                        }}>
                            <Button variant="contained" size="small" onClick={login}>Log In</Button>
                        </Box> 
                    </CardContent>
                </Card>
            </Box>
    </AppTheme>
    )
}