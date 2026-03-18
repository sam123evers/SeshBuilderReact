import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import {IDeletePoseFromSequencePayload} from '../../shared/declared-types';
import { useMutation } from "@tanstack/react-query";

interface IConfirmDeleteProps {
    deletePayload: IDeletePoseFromSequencePayload;
    toggleConfirmDelete: Function;
    refreshSessionData: Function;
}

export default function ConfirmDeletePoseFromSequence({
    deletePayload,
    toggleConfirmDelete,
    refreshSessionData
}: IConfirmDeleteProps) {

    const mutation = useMutation({
            mutationFn: async (seqPoseId: number) => {
                const response = await fetch(
                    `https://localhost:7122/api/Sequence/RemovePoseFromSequence/${seqPoseId}`, {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'}
                    }
                );
                return await response.json()
            },
            onSuccess: () => {
                // close the modal and reload session data
                toggleConfirmDelete(false);
                refreshSessionData();
            },
            onError: (error) => {
                console.error('Error deleting pose from sequence:', error);
                alert('Failed to delete pose from sequence.');
            },
        });

    const closeConfirmDelete = () => {
        toggleConfirmDelete(false);
    }

    const confirmDelete = () => {
        mutation.mutate(deletePayload.sequencePoseId)
    }

    return(
        <Box sx={{
            position: 'absolute',
            justifySelf: 'center',
            backgroundColor: 'black',
            top: '50vh',
            zIndex: 5,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
           <Card sx={{width: '20vw' }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        Are you sure you want to remove {deletePayload.poseName} from {deletePayload.sequenceName} ?
                    </Typography>
                </CardContent>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="contained" size="small" onClick={closeConfirmDelete}>
                        Cancel
                    </Button>
                    <Button variant="contained" size="small" onClick={confirmDelete}>
                        Remove
                    </Button>
                </Box>
            </Card> 
        </Box>
    )
}