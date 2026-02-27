import { ChangeEvent, MouseEventHandler, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    Autocomplete,
    Box,
    Button, 
    Card, 
    CardContent,
    TextField,
    Typography
} from '@mui/material';
import { IPose } from '../../shared/declared-types';

interface IPoseModalProps {
    sessionName: string;
    closePoseToSequenceModal: MouseEventHandler
}

interface IAutocompleteOption {
  id: number;
  label: string;
  photo: string;
}

// import this?
interface IPoseData {
    poseName: string | undefined;
    photoUrl: string | undefined;
}

// we need a list of poses from the db in this component

export default function AddPoseToSequenceModal({sessionName, closePoseToSequenceModal}: IPoseModalProps) {
    const queryClient = useQueryClient();
    const [selectedPose, setSelectedPose] = useState<string>();
    const [poseAutocompleteOptions, setPoseAutocompleteOptions] = useState<IAutocompleteOption[]>([]);

    // const setUrlFromInput = (event: ChangeEvent<HTMLInputElement>) => {
    //     setPicUrl(event.target.value);
    // }

    // const setPoseNameFromInput = (event: ChangeEvent<HTMLInputElement>) => {
    //     setPoseName(event.target.value)
    // }

    const submitAddPoseToSequence = () => {
        // mutation.mutate({poseName, photoUrl});
    }

    const { data: poseListData } = useQuery({
        queryKey: ['allPoses'],
        queryFn: async () => {
        const response = await fetch(
            `https://localhost:7122/api/Pose/GetPoses`,
        )
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }
            return await response.json();  
        },
        // enabled: sessionId !== null
    });

    useEffect(() => {
        if (poseListData) {
            const mappedList: IAutocompleteOption[] = poseListData.map((poseObj: IPose) => {
                return {
                    id: poseObj.poseId,
                    label: poseObj.poseName,
                    photo: poseObj.photoUrl
                }
      });
      setPoseAutocompleteOptions(mappedList)
    }
  }, [poseListData]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}
        >
            <Card sx={{ width: '20vw' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        Add Pose To <br/> {sessionName} <br/>
                    </Typography>
                    <Box>
                        <Box sx={{ 
                                    '& .MuiTextField-root': { m: 1, width: '45ch' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                        >
                            <Autocomplete
                                disablePortal
                                options={poseAutocompleteOptions}
                                getOptionLabel={(option) => option.label}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Poses" />}
                            />
                        </Box>
                    </Box>
                </CardContent>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="contained" size="small" onClick={closePoseToSequenceModal}>
                        Cancel
                    </Button>
                    <Button variant="contained" size="small" onClick={submitAddPoseToSequence}>
                        Add
                    </Button>
                </Box>
            </Card>
        </Box>
    )
}