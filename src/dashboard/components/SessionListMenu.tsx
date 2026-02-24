import {useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import { ISession } from '../../shared/declared-types.tsx';

interface ISessionListProps {
  sessions: ISession[];
  selectSesh: Function;
  setSessionName: Function;
}

export default function SessionListMenu({sessions = [], selectSesh, setSessionName}: ISessionListProps) {
  const [selectedSesh, setSelectedSesh] = useState<number>();
  const handleClick = (session: ISession) => {
    selectSesh(session.sessionId);
    setSessionName(session.sessionName);
    setSelectedSesh(session.sessionId);
  }
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {sessions.map((item) => (
          <ListItem key={item.sessionId} onClick={() => handleClick({
                sessionId: item.sessionId,
                sessionName: item.sessionName,
                sessionAlternateName: undefined,
                sequences: undefined
              })} disablePadding sx={{ display: 'block' }}
          >
            <ListItemButton selected={item.sessionId === selectedSesh}>
              <ListItemText primary={item.sessionName} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
