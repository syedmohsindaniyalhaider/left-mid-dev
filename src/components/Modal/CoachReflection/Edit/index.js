import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Box, Modal, Button, IconButton, Stack, Typography, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';

import { style } from 'utils/constant/style';
import SampleInput from '../Add/SampleInput';
import { editCoachReflection } from 'global/redux/player/thunk';
import CommentThread from 'components/CommentThread';

const EditReflectionForm = ({ playerAssessmentId, toggle, setToggle, data, toggleNote, setToggleNote }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(data);
  const userInfo = useSelector(({auth}) => auth.userInfo);
  const { isEditing, trainingNote } = useSelector(({player}) => ({
    isEditing: player.isEditing,
    trainingNote: player.trainingNote
  }));
  const assessmentInfo = useSelector(({assessment}) => assessment.assessmentInfo);

  const handleToggleForm = useCallback(() => {
    setOpen(!open);
    setToggle(false);
    setToggleNote(false);
    setContent(data);
  }, [open, setToggle, setToggleNote, setContent, data]);

  const handleToggleQuickAdd = useCallback(() => {
    setToggle(!toggle);
  }, [toggle, setToggle]);

  const handleToggleNote = useCallback(() => {
    setToggleNote(!toggleNote);
  }, [toggleNote, setToggleNote]);

  const handleChange = useCallback((event) => {
    setContent(event.target.value);
  }, []);
	
  const handleEdit = useCallback(async () => {
    const res = await dispatch(editCoachReflection({
      playerAssessmentId, 
      coachId: userInfo.id,
      coachName: `${userInfo.firstName} ${userInfo.lastName}`, 
      assessmentId: assessmentInfo.id, 
      content, 
      data, 
    }));
    if (res.payload.status) {
      setToggle(false);
      setToggleNote(false);
      setOpen(false);
    }
  // eslint-disable-next-line max-len
  }, [playerAssessmentId, userInfo, assessmentInfo, content, setOpen, setToggle, dispatch, data, setToggleNote]);

  useEffect(() => {
    setContent(data);
  }, [data]);

  return (
    <React.Fragment>
      <IconButton
        color='info' 
        onClick={handleToggleForm} 
        variant='outlined' 
        disabled={userInfo.id !== assessmentInfo.coachID}
      >
        <EditIcon/>
      </IconButton>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleToggleForm}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box 
          sx={{
            ...style, 
            boxShadow: 0,
            width: toggle && toggleNote ? '40vw' : '50vw',
            height: '80vh',
            transform: toggle && toggleNote 
              ? 'translate(-60%, -50%)' 
              : toggle 
                ? 'translate(-80%, -50%)' 
                : 'translate(-50%, -50%)'
          }}
        >
          <Typography variant='h2'>
						Edit
          </Typography>
          <TextField
            id='outlined-multiline-static'
            label=''
            multiline
            value={content}
            onChange={handleChange}
            rows={25}
            inputProps={{style: {fontSize: 16}}}
            sx={{
              outline: 'none',
              mt: 2,
              width: '100%',
              '& label.Mui-focused': {
                color: 'green',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'black',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black',
                  borderRadius: '5px'
                },
                '&:hover fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black',
                },
              },
            }}
          />
          <IconButton 
            onClick={handleToggleForm}
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
          {
            toggle && (
              <SampleInput onToggle={handleToggleQuickAdd} setContent={setContent} toggleNote={toggleNote}/>
            )
          }
          {
            toggleNote && (
              <CommentThread toggleQuickAdd={toggle} setContent={setContent}/>
            )
          }
          <Stack 
            gap={3}
            direction='row'
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              mb: 3,
              mr: 3
            }}
          >
            <Button
              disableElevation
              variant='contained'
              startIcon={<CommentIcon/>}
              disabled={trainingNote?.length === 0}
              onClick={handleToggleNote} 
              sx={{
                color: 'white'
              }}
            >
              {trainingNote?.length === 0 ? 'No Note' : 'Training Notes'}
            </Button>
            <Button 
              color='primary' 
              onClick={handleToggleQuickAdd} 
              startIcon={<ArticleIcon/>} 
              variant='contained' 
              disableElevation
              sx={{color: 'background.paper'}}
            >
							Sample Sentence
            </Button>
            <LoadingButton
              size='medium'
              onClick={handleEdit}
              loading={isEditing}
              variant='contained'
              color='success'
              disabled={content?.length === 0 || content === data}
              disableElevation
              sx={{
                color: 'white'
              }}
            >
							Save
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

EditReflectionForm.propTypes = {
  playerId: PropTypes.string, 
  toggle: PropTypes.bool, 
  setToggle: PropTypes.func, 
  data: PropTypes.string, 
  createdAt: PropTypes.number, 
  index: PropTypes.number
};

export default EditReflectionForm;