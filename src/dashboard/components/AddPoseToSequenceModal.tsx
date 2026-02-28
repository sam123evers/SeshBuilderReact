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
    seqId: number;
    seqName: string;
    closePoseToSequenceModal: MouseEventHandler
}

interface IAddPoseToSeq {
    sequenceId: number;
    poseId: number;
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

export default function AddPoseToSequenceModal({
    sessionName,
    seqId,
    seqName,
    closePoseToSequenceModal
}: IPoseModalProps) {
    const queryClient = useQueryClient();
    const [selectedPoseObj, setSelectedPoseObj] = useState<IAutocompleteOption>({id:-1, label: "None", photo: "None"});
    const [poseAutocompleteOptions, setPoseAutocompleteOptions] = useState<IAutocompleteOption[]>([]);

    const handleChange = (e: ChangeEvent, value: IAutocompleteOption) => {
        e.preventDefault();
        setSelectedPoseObj(value);
    };

    const submitAddPoseToSequence = () => {
        console.log("sequenceId: ", seqId);
        console.log("poseId: ", selectedPoseObj.id)
        const payload: IAddPoseToSeq = {
            sequenceId: seqId,
            poseId: selectedPoseObj.id
        }
        mutation.mutate(payload);
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
    });

    const mutation = useMutation({
            mutationFn: async (addPoseToSeqData: IAddPoseToSeq) => {
                const response = await fetch(
                    `https://localhost:7122/api/Sequence/AddPoseToSequence`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(addPoseToSeqData)
                    }
                );
                return await response.json()
            },
            onSuccess: () => {
                // Invalidate and refetch queries after a successful mutation
                queryClient.invalidateQueries({ queryKey: ['sequences'] });
                alert('Added Pose To Sequence successfully!');
            },
            onError: (error) => {
                console.error('Error creating new sequence:', error);
                alert('Failed to add pose to sequence.');
            },
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
                        Add Pose To <br/> {sessionName} <br/> {seqName}
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
                                onChange={handleChange}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Select a Pose..." />}
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