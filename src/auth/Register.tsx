import {useState, type ChangeEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';

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

interface IRegistrationData {
    email: string | undefined;
    password: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
}

export default function Register() {
    const navigate = useNavigate();
    const [registrationEmail, setRegistrationEmail] = useState<string>('');
    const [registrationPassword, setRegistrationPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [registrationFirstName, setRegistrationFirstName] = useState<string>('');
    const [registrationLastName, setRegistrationLastName] = useState<string>('');

    const handleRegistrationEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRegistrationEmail(e.target.value);
    }

    const handleRegistrationPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRegistrationPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }

    const handleRegistrationFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRegistrationFirstName(e.target.value);
    }

    const handleRegistrationLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRegistrationLastName(e.target.value);
    }

    const confirmPasswordMatch = () => {
        return registrationPassword === confirmPassword;
    };

    const createNewUser = () => {
        if(confirmPasswordMatch()) {
            registerUser.mutate({
                email: registrationEmail,
                password: registrationPassword,
                firstName: registrationFirstName,
                lastName: registrationLastName,
            });
        }
    };

    const registerUser = useMutation({
    mutationFn: async (newUserData: IRegistrationData) => {
        const response = await fetch(
        'https://localhost:7122/api/User/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUserData)
        }
      )
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    },
    onSuccess: (response) => {
      // Invalidate and refetch queries after a successful mutation
      // queryClient.invalidateQueries({ queryKey: ['posts'] });
      alert('User created successfully!');
      const emailToPass = typeof response === 'string'
        ? response
        : response?.email ?? '';

      navigate('/login', { state: { email: emailToPass } });
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
                            Create an Account
                        </Typography>
                        <TextField required id="registration-first-name" value={registrationFirstName} label="First Name" variant="outlined" onChange={handleRegistrationFirstNameChange} />
                        <TextField required id="registration-last-name" value={registrationLastName} label="Last Name" variant="outlined" onChange={handleRegistrationLastNameChange} />
                        <TextField required id="registration-email" value={registrationEmail} label="Email" variant="outlined" onChange={handleRegistrationEmailChange}/>
                        <TextField required id="registration-password" value={registrationPassword} label="Password" variant="outlined" onChange={handleRegistrationPasswordChange} />
                        <TextField required id="confirm-password" value={confirmPassword} label="Confirm Password" variant="outlined" onChange={handleConfirmPasswordChange} />
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row', 
                            justifyContent: 'flex-end',
                        }}>
                            <Button variant="contained" size="small" onClick={createNewUser}>Sign Up</Button>
                        </Box> 
                    </CardContent>
                </Card>
            </Box>
    </AppTheme>
    )
}