import {MouseEventHandler, useState} from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack
} from '@mui/material';
import Copyright from '../internals/components/Copyright';
import {ISequence} from '../../shared/declared-types';
import AddPoseModal from './AddPoseModal';
import AddSequenceModal from './AddSequenceModal';
import AddPoseToSequenceModal from './AddPoseToSequenceModal';
import PoseImageList from './PoseImageList';

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
  closeSequenceCreateModal: MouseEventHandler;
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
  closeSequenceCreateModal
}: IMainGridProps) {
  // could we make a TS interface and set both of these at once?
  const [selectedSeqId, setSelectedSeqId] = useState<number>(-1);
  const [selectedSeqName, setSelectedSeqName] = useState<string>("");

  const handleAddSequenceModalClick = () => {
    toggleShowSequenceModal(true);
  }

  const handleAddPoseToSeqModalClick = (seqId: number, seqName:string) => {
    setSelectedSeqId(seqId);
    setSelectedSeqName(seqName);
    toggleShowAddPoseToSeqModal(true);
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
      <AddPoseToSequenceModal sessionName={sessionName} seqId={selectedSeqId} seqName={selectedSeqName} closePoseToSequenceModal={handleClosePoseToSeqClick} />
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
        <AddSequenceModal closeSequenceCreateModal={closeSequenceCreateModal} sessionId={sessionId} sessionName={sessionName}/>
        <Copyright sx={{ my: 4 }} />
      </Box>
    )
  } else if (seshSequences.length > 0) {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
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
                </ListItemButton>
                <PoseImageList seqId={seq.sequenceId} seqName={seq.sequenceName} poses={seq.poses} openAddPoseToSequenceModal={handleAddPoseToSeqModalClick}/>
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
