import {ChangeEvent, MouseEventHandler, useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    Box,
    Button, 
    Card, 
    CardContent,
    TextField,
    Typography
} from '@mui/material';

interface SequenceModalProps {
    sessionId: number;
    sessionName: string;
    closeSequenceCreateModal: MouseEventHandler
}

interface ISequenceCreate {
    sessionId: number;
    sequenceName: string;
}

export default function AddPoseModal({sessionId, sessionName, closeSequenceCreateModal}: SequenceModalProps) {
    const queryClient = useQueryClient();
    const [sequenceName, setSequenceName] = useState<string>("");

    const setSequenceNameFromInput = (event: ChangeEvent<HTMLInputElement>) => {
        setSequenceName(event.target.value)
    }

    const submitAddSequence = () => {
        console.log("sessionId: ", sessionId);
        console.log("sequenceName: ", sequenceName);
        const payload: ISequenceCreate = {
            sessionId: sessionId,
            sequenceName: sequenceName

        }
        mutation.mutate(payload);
    }

    const mutation = useMutation({
        mutationFn: async (seqData: ISequenceCreate) => {
            const response = await fetch(
                `https://localhost:7122/api/Sequence/CreateSequence`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(seqData)
                }
            );
            return await response.json()
        },
        onSuccess: () => {
            // Invalidate and refetch queries after a successful mutation
            queryClient.invalidateQueries({ queryKey: ['sequences'] });
            alert('Added Sequence to Session created successfully!');
        },
        onError: (error) => {
            console.error('Error creating new sequence:', error);
            alert('Failed to add sequence.');
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
                        Add Sequence to Session
                    </Typography>
                    <Box>
                        <Box sx={{ 
                                    '& .MuiTextField-root': { m: 1, width: '45ch' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                        >
                            <Typography>
                                {sessionName}
                            </Typography>
                            <TextField 
                                required 
                                id="sequence-name" 
                                label="Sequence Name" 
                                variant="outlined" 
                                value={sequenceName}
                                onChange={setSequenceNameFromInput}
                            />
                            
                        </Box>
                    </Box>
                </CardContent>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="contained" size="small" onClick={closeSequenceCreateModal}>
                        Cancel
                    </Button>
                    <Button variant="contained" size="small" onClick={submitAddSequence}>
                        Add
                    </Button>
                </Box>
            </Card>
        </Box>
    )
}