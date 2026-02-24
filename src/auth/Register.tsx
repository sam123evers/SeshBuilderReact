// import {ChangeEvent, MouseEventHandler, useState} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';

import {
    Box,
    Button,
    Card,
    CardContent,
    CssBaseline,
    TextField,
    Typography,
    // Button, 
    // Card, 
    // CardContent,
    // TextField,
    // Typography
} from '@mui/material';
import AppTheme from '../shared-theme/AppTheme';

// interface PoseModalProps {
//     closePoseCreateModal: MouseEventHandler
// }

export default function Register() {
    const queryClient = useQueryClient();
    // const [picUrl, setPicUrl] = useState<string>();

    // const setUrlFromInput = (event: ChangeEvent<HTMLInputElement>) => {
    //     setPicUrl(event.target.value);
    // }

    const registerUser = useMutation({
    mutationFn: async () => {
        const response = await fetch(
        'https://localhost:7122/register',
      )
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch queries after a successful mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      alert('Post created successfully!');
    },
    onError: (error) => {
      console.error('Error registering user:', error);
      alert('Failed to register new user.');
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
                        <TextField required id="registration-email" label="Email" variant="outlined" />
                        <TextField required id="registration-password" label="Password" variant="outlined" />
                        <TextField required id="confirm-password" label="Confirm Password" variant="outlined" />
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