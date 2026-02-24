import {ChangeEvent, MouseEventHandler, useEffect, useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    Box,
    Button, 
    Card, 
    CardContent,
    TextField,
    Typography
} from '@mui/material';

interface IPoseModalProps {
    closePoseCreateModal: MouseEventHandler
}

// can we import this from declared-types?
// make poseId a nullable field?
interface IPoseData {
    poseName: string | undefined;
    photoUrl: string | undefined;
}

export default function AddPoseModal({closePoseCreateModal}: IPoseModalProps) {
    const queryClient = useQueryClient();
    const [poseName, setPoseName] = useState<string>();
    const [photoUrl, setPicUrl] = useState<string>();
    const [isPicSet, toggleIsPicSet] = useState<boolean>(false);

    const setUrlFromInput = (event: ChangeEvent<HTMLInputElement>) => {
        setPicUrl(event.target.value);
    }

    const setPoseNameFromInput = (event: ChangeEvent<HTMLInputElement>) => {
        setPoseName(event.target.value)
    }

    const submitAddPose = () => {
        mutation.mutate({poseName, photoUrl});
    }

    useEffect(() => {
        if(photoUrl === undefined || photoUrl === '') {
            toggleIsPicSet(false);
        } else {
            toggleIsPicSet(true);
        }
    }, [photoUrl]);

    const mutation = useMutation({
        mutationFn: async (newPoseData: IPoseData) => {
            const response = await fetch(
                `https://localhost:7122/api/Pose/CreatePose`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(newPoseData)
                }
            );
            return await response.json()
        },
        onSuccess: () => {
        // Invalidate and refetch queries after a successful mutation
            queryClient.invalidateQueries({ queryKey: ['poses'] });
            alert('Post created successfully!');
        },
        onError: (error) => {
            console.error('Error creating new pose:', error);
            alert('Failed to create pose.');
        },
    });

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}
        >
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        Add To Pose Database
                    </Typography>
                    <Box>
                        <Box sx={{ 
                                    '& .MuiTextField-root': { m: 1, width: '45ch' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                        >
                            <TextField 
                                required 
                                id="pose-name" 
                                label="Pose Name" 
                                variant="outlined" 
                                value={poseName}
                                onChange={setPoseNameFromInput}
                            />
                            <TextField 
                                required id="photo-url-upload"
                                label="Photo URL"
                                variant="outlined"
                                value={photoUrl}
                                onChange={setUrlFromInput}
                            />
                            <TextField id="variant" label="Variant" variant="outlined" />
                            <TextField id="difficulty" label="Difficulty" variant="outlined" />
                            <TextField id="breath-tech" label="Breathing Technique" variant="outlined" />
                        </Box>
                        {isPicSet && <Box sx={{ 
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                        >
                            <img src={photoUrl} style={{marginLeft: '15em', marginRight: '15em'}}/>
                        </Box>}
                        <Box sx={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                            <Box sx={{ 
                                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <TextField id="target-area-input" label="Target Area" variant="outlined" />
                                <TextField id="benefit-input" label="Benefit" variant="outlined" />
                            </Box>
                            <Box sx={{ 
                                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <TextField id="variations" label="Variations" variant="outlined" />
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="contained" size="small" onClick={closePoseCreateModal}>
                        Cancel
                    </Button>
                    <Button variant="contained" size="small" onClick={submitAddPose}>
                        Add
                    </Button>
                </Box>
            </Card>
        </Box>
    )
}