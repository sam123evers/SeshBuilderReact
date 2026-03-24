import {MouseEventHandler, useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  // Icon,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Menu,
  MenuItem
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Copyright from '../internals/components/Copyright';
import AddPoseModal from './AddPoseModal';
import AddSequenceModal from './AddSequenceModal';
import AddPoseToSequenceModal from './AddPoseToSequenceModal';
import PoseImageList from './PoseImageList';
import ConfirmDeletePoseFromSequence from './ConfirmDeletePoseFromSequence';

import {ISequence, IDeletePoseFromSequencePayload} from '../../shared/declared-types';


interface IMainGridProps {
  sessionId: number;
  sessionName: string;
  toggleShowSequenceModal: Function;
  toggleShowAddPoseToSeqModal: Function;
  renderSequenceModal: boolean;
  renderPoseModal: boolean;
  renderAddPoseToSequenceModal: boolean;
  seshSequences: ISequence[];
  closePoseCreateModal: MouseEventHandler;
  closeSequenceCreateModal: Function;
  retriggerSessionData: Function;
}

export default function MainGrid({
  sessionId,
  sessionName,
  toggleShowSequenceModal,
  toggleShowAddPoseToSeqModal,
  renderSequenceModal,
  renderPoseModal,
  renderAddPoseToSequenceModal,
  seshSequences = [],
  closePoseCreateModal,
  closeSequenceCreateModal,
  retriggerSessionData,
}: IMainGridProps) {

  // could we make a TS interface and set both of these at once?
  const [selectedSeqId, setSelectedSeqId] = useState<number>(-1);
  const [selectedSeqName, setSelectedSeqName] = useState<string>("");
  const [showConfirmDelete, toggleShowConfirmDelete] = useState<boolean>(false);
  const [deletePosePayload, setDeletePosePayload] = useState<IDeletePoseFromSequencePayload>({
    sequenceName: "",
    poseName: "",
    sequencePoseId: -1
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleAddSequenceModalClick = () => {
    toggleShowSequenceModal(true);
  }

  const handleAddPoseToSeqModalClick = (seqId: number, seqName:string) => {
    setAnchorEl(null);
    setSelectedSeqId(seqId);
    setSelectedSeqName(seqName);
    toggleShowAddPoseToSeqModal(true);
  }

  const queryClient = useQueryClient();

  const deleteSequenceMutation = useMutation({
    mutationFn: async (sequenceId: number) => {
      const response = await fetch(
        `https://localhost:7122/api/Session/RemoveSequence/${sequenceId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete sequence: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sequences'] });
      retriggerSessionData();
      alert('Sequence deleted successfully.');
    },
    onError: (error) => {
      console.error('Error deleting sequence:', error);
      alert('Failed to delete sequence.');
    },
  });

  const handleDeleteSequence = (sequenceId: number) => {
    setAnchorEl(null);
    deleteSequenceMutation.mutate(sequenceId);
  }

  const handleClosePoseToSeqClick = () => {
    toggleShowAddPoseToSeqModal(false);
  }

  if(renderPoseModal) {
    return(
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',width: '100%', maxWidth: { sm: '100%', md: '10%' } }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2, width: '100%', fontSize: 'x-large' }}>
            Add Pose
          </Typography>
        </Box>
      <AddPoseModal closePoseCreateModal={closePoseCreateModal}/>
      <Copyright sx={{ my: 4 }} />
    </Box>
    )
  } else if (renderAddPoseToSequenceModal) {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2, width: '100%', fontSize: 'x-large' }}>
            Add Pose To Sequence
          </Typography>
        </Box>
      <AddPoseToSequenceModal
        // sessionId={sessionId} 
        sessionName={sessionName}
        seqId={selectedSeqId}
        seqName={selectedSeqName}
        closePoseToSequenceModal={handleClosePoseToSeqClick}
        refreshSessionData={retriggerSessionData}
      />
      <Copyright sx={{ my: 4 }} />
    </Box>
    )
  } else if (renderSequenceModal) {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: { sm: '100%', md: '10%' } }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2, width: '100%', fontSize: 'x-large' }}>
            Create Sequence
          </Typography>
        </Box>
        <AddSequenceModal
          closeSequenceCreateModal={closeSequenceCreateModal}
          sessionId={sessionId}
          sessionName={sessionName}
        />
        <Copyright sx={{ my: 4 }} />
      </Box>
    )
  } else if (seshSequences.length > 0) {
    return (
      <Box sx={{ position: 'relative', width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        {showConfirmDelete && 
            <ConfirmDeletePoseFromSequence 
              deletePayload={deletePosePayload}
              toggleConfirmDelete={toggleShowConfirmDelete}
              refreshSessionData={retriggerSessionData}
            />
        }
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',width: '100%', maxWidth: { sm: '100%', md: '10%' } }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2, width: '100%', fontSize: 'x-large' }}>
            Sequences
          </Typography>
          <Button variant="contained" sx={{ mb: 2, height: '30px', minWidth: '40px' }} onClick={handleAddSequenceModalClick}>+</Button>
        </Box>
        <Stack>
          <List>
            {seshSequences.map((seq) => (
              <ListItem key={seq.sequenceId} disablePadding sx={{ display: 'block', width: 'auto' }}>
                <ListItemButton selected sx={{ display: 'flex', justifyContent: 'center'}}>
                    <ListItemText 
                      primary={seq.sequenceName} 
                      slotProps={{
                        primary: {
                          style : { 
                            fontSize: '1.5rem',
                            textAlign: 'center'
                          }
                        },
                      }}
                    />
                    <div>
                      <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                      >
                        <MoreHorizIcon fontSize="large"/>
                      </Button>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                          list: {
                            'aria-labelledby': 'basic-button',
                          },
                        }}
                      >
                        <MenuItem onClick={() => handleAddPoseToSeqModalClick(seq.sequenceId, seq.sequenceName)}>Add Pose</MenuItem>
                        <MenuItem onClick={() => handleDeleteSequence(seq.sequenceId)}>Delete Sequence</MenuItem>
                        <MenuItem onClick={handleClose}>Edit Sequence</MenuItem>
                      </Menu>
                    </div>
                </ListItemButton>
                <PoseImageList 
                  seqId={seq.sequenceId}
                  seqName={seq.sequenceName}
                  poses={seq.poses}
                  openAddPoseToSequenceModal={handleAddPoseToSeqModalClick}
                  toggleConfirmDelete={toggleShowConfirmDelete}
                  setDeletePayload={setDeletePosePayload}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
        <Copyright sx={{ my: 4 }} />
      </Box>
    );
  } else {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
          <Typography component="h2" variant="h6" sx={{ display: 'flex', justifyContent: 'center',  mb: 2, width: '100%', fontSize: 'x-large' }}>
            Select A Session
          </Typography>
        </Box>
        <Copyright sx={{ my: 4 }} />
      </Box>
    )
  }
}
