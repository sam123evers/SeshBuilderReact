import { useQuery } from '@tanstack/react-query'
import {useState, useEffect, MouseEventHandler} from 'react';
import {useAuth} from '../auth/AuthContext';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';

import { ISession } from '../shared/declared-types.tsx'

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const [allSessions, setAllSessions] = useState<ISession[]>([]);
  const [sessionId, setSessionId] = useState<number>(-1);
  const [sessionName, setSessionName] = useState<string>("");
  const [shouldShowSequenceModal, toggleShowSequenceModal] = useState<boolean>(false);
  const [shouldShowPoseModal, toggleShowPoseModal] = useState<boolean>(false);
  const [shouldShowAddPoseToSeqModal, toggleShowAddPoseToSeqModal] = useState<boolean>(false);

  const { token } = useAuth();

  const setSelectedSession = (sessionId: number, sessionName: string) => {
    setSessionId(sessionId);
    setSessionName(sessionName);
    toggleShowSequenceModal(false);
    toggleShowPoseModal(false);
    toggleShowAddPoseToSeqModal(false);
  }

  const handlePoseModalClick = () => {
    toggleShowPoseModal(true)
  }

  const closeSequenceCreateModal: Function = () => {
    toggleShowSequenceModal(false)
  }

  const closePoseCreateModal: MouseEventHandler = () => {
    toggleShowPoseModal(false)
  }

  const {data: currentUserData} = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch(
        ' https://localhost:7122/api/User/current_user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      console.log("user Data: ", currentUserData);
      return await response.json()
    },
    enabled: token !== null
  });

  const { data: sessionData } = useQuery({
    queryKey: ['sessionData'],
    queryFn: async () => {
      const response = await fetch(
        'https://localhost:7122/api/Session/GetAllSessions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    },
  });

  useEffect(() => {
    if (sessionData) {
      setAllSessions(sessionData);
    }
  }, [allSessions]);

  const { data: seqAndPoseData, refetch } = useQuery({
    queryKey: ['sequenceAndPoseData', sessionId],
    queryFn: async () => {
      const response = await fetch(
        `https://localhost:7122/api/Sequence/SequencesAndPoses/${sessionId}`,
      )
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    },
    enabled: sessionId !== null
  });

  const refreshSessionData = () => {
    refetch();
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu 
          sessiondata={sessionData} 
          selectsession={setSelectedSession}
          setSessionName={setSessionName}
          currentUser={currentUserData}
        />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header handleAddPoseModalClick={handlePoseModalClick} />
            <MainGrid
              sessionId={sessionId}
              sessionName={sessionName}
              retriggerSessionData={refreshSessionData}
              toggleShowSequenceModal={toggleShowSequenceModal}
              renderSequenceModal={shouldShowSequenceModal}
              closeSequenceCreateModal={closeSequenceCreateModal}
              renderPoseModal={shouldShowPoseModal} 
              closePoseCreateModal={closePoseCreateModal}
              toggleShowAddPoseToSeqModal={toggleShowAddPoseToSeqModal}
              renderAddPoseToSequenceModal={shouldShowAddPoseToSeqModal}
              seshSequences={seqAndPoseData}/>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
