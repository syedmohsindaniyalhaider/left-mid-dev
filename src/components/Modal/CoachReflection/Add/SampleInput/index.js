import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography,
  List, 
  IconButton, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Collapse,
  ListItem,
  TextField 
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { addUserQuickSentence, deleteUserQuickSentence } from 'global/redux/auth/thunk';
import { SAMPLE_INPUT } from 'utils/constant';
import { style } from 'utils/constant/style';
import SearchBar from 'components/SearchBar';

const SampleInput = ({ onToggle, setContent, toggleNote }) => {
  const dispatch = useDispatch();
  const draft = useSelector(({player}) => player.draft);
  const [lastReflection, setLastReflection] = useState(false);
  const [openSuggested, setOpenSuggested] = useState(false);
  const [userSentence, setUserSentence] = useState(false);
  const [toggleAddSentence, setToggleAddSentence] = useState(false);
  const [userInput, setUserInput] = useState('');
  const { quickSentence, userInfo } = useSelector(({auth}) => ({
    quickSentence: auth.quickSentence,
    userInfo: auth.userInfo
  }));

  const handleTogglePastInput = useCallback(() => {
    setLastReflection(!lastReflection);
  },[lastReflection]);

  const handleToggleSuggestedInput = useCallback(() => {
    setOpenSuggested(!openSuggested);
  }, [openSuggested]);

  const handleToggleUserSentence = useCallback(() => {
    setUserSentence(!userSentence);
  }, [userSentence]);

  const handleAddOption = useCallback((e) => {
    setContent(prev => prev + ' ' + e);
  }, [setContent]);

  const handleDelete = useCallback((content) => {
    dispatch(deleteUserQuickSentence({
      userId: userInfo.id,
      content: content
    }));
  },[dispatch, userInfo.id]);

  const handleAddUserSentence = useCallback(() => {
    setToggleAddSentence(!toggleAddSentence);
  },[toggleAddSentence]);

  const handleEnter = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && userInput) {
      dispatch(addUserQuickSentence({
        userId: userInfo.id,
        content: userInput
      }));
      setUserInput('');
      setToggleAddSentence(false);
    }
  }, [dispatch, userInfo.id, userInput]);

  return (
    <Box
      sx={{
        ...style,
        boxShadow: 0,
        height: '95vh',
        width: '30vw',
        transform: toggleNote ? 'translate(75%, -50%)' : 'translate(100%, -50%)',
        overflow: 'auto'
      }}
    >
      <Typography variant='h2'>
				Quick Sentences
      </Typography>
      <List
        sx={{ 
          width: '100%',
          height: '80%',
          overflow: 'auto',
          bgcolor: 'background.paper', 
        }}
        component='nav'
        aria-labelledby='nested-list-subheader'
      >
        <ListItemButton onClick={handleTogglePastInput}>
          <ListItemIcon>
            <HistoryIcon color='secondary'/>
          </ListItemIcon>
          <ListItemText primary='Last reflections' />
          {lastReflection ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={lastReflection} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton 
              disabled={!draft}
              sx={{ pl: 2 }} 			 
              onClick={() => {
                if (draft) handleAddOption(draft);
              }}
            >
              <ListItemText primary={draft || 'Empty'} />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={handleToggleUserSentence}>
          <ListItemIcon>
            <AccountBoxIcon color='secondary' />
          </ListItemIcon>
          <ListItemText primary='User Reference'/>
          {userSentence ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={userSentence} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {
              quickSentence?.map((item, index) => (
                <ListItem key={index}                   
                  secondaryAction={
                    <IconButton edge='end' aria-label='delete' onClick={() => handleDelete(item)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                  <ListItemButton>                  
                    <ListItemText primary={item} onClick={() => handleAddOption(item)}/>
                  </ListItemButton>
                </ListItem>
              ))
            }
            <ListItemButton onClick={handleAddUserSentence}>
              <ListItemText primary='Add new...'/>
            </ListItemButton>
          </List>
          <Collapse in={toggleAddSentence} timeout='auto' unmountOnExit sx={{mt: 1, mb: 1}}>
            <TextField
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
              onKeyPress={(e) => handleEnter(e)}
              id='outlined-textarea'
              placeholder='Enter your comment'
              sx={{width: '100%'}}
            />
          </Collapse>
        </Collapse>

        <ListItemButton onClick={handleToggleSuggestedInput}>
          <ListItemIcon>
            <AddCircleIcon color='secondary' />
          </ListItemIcon>
          <ListItemText primary='Suggested Sentence' />
          {openSuggested ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSuggested} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {
              SAMPLE_INPUT.map((item, index) => (
                <ListItemButton key={index}>
                  <ListItemText primary={item} onClick={() => handleAddOption(item)}/>
                </ListItemButton>
              ))
            }
          </List>
        </Collapse>

      </List>
      <IconButton 
        onClick={onToggle}
        color='error' 
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          mt: 2,
          mr: 3
        }}
      >
        <CloseIcon/>
      </IconButton>
      <SearchBar setContent={setContent}/>
    </Box>
  );
};

SampleInput.propTypes = {
  onToggle: PropTypes.func,
  setContent: PropTypes.func
};

export default SampleInput;