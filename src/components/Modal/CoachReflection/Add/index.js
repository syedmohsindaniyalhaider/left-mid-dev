import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, Button, IconButton, Stack, Typography, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

import AddBoxIcon from '@mui/icons-material/AddBox';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';

import { style } from 'utils/constant/style';
import SampleInput from './SampleInput';
import { addCoachReflection } from 'global/redux/player/thunk';
import CommentThread from 'components/CommentThread';

const AddReflectionForm = ({ playerAssessmentId, toggle, setToggle, toggleNote, setToggleNote }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const userInfo = useSelector(({auth}) => auth.userInfo);
  const { isLoading, reflection, trainingNote } = useSelector(({player}) => ({
    isLoading: player.isLoading,
    reflection: player.reflection,
    trainingNote: player.trainingNote
  }));
  const assessmentInfo = useSelector(({assessment}) => assessment.assessmentInfo);

  const handleOpen = useCallback(() => {
    setOpen(!open);
    setToggle(false);
    setToggleNote(false);
  }, [open, setToggle, setToggleNote]);

  const handleClear = useCallback(() => {
    setContent('');
  }, []);

  const handleToggleNote = useCallback(() => {
    setToggleNote(!toggleNote);
  }, [toggleNote, setToggleNote]);

  const handleAdd = useCallback(async () => {
    await dispatch(addCoachReflection({
      assessmentId: assessmentInfo.id,
      playerAssessmentId,
      coachId: userInfo.id,
      coachName: `${userInfo.firstName} ${userInfo.lastName}`,
      content: content
    }));
    setContent('');
    setToggle(false);
    setToggleNote(false);
    setOpen(false);
  }, [content, assessmentInfo, dispatch, playerAssessmentId, setToggle, userInfo, setToggleNote]);

  const handleChange = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const handleToggleQuickAdd = useCallback(() => {
    setToggle(!toggle);
  }, [toggle, setToggle]);

  return (
    <React.Fragment>
      <Button 
        disabled={reflection?.content?.length > 0 || assessmentInfo?.coachID !== userInfo?.id || isLoading} 
        color='primary' 
        onClick={handleOpen} 
        startIcon={<AddBoxIcon/>} 
        variant='contained' 
        disableElevation
        sx={{color: 'white'}}
      >
				Add
      </Button>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleOpen}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box 
          sx={{
            ...style, 
            boxShadow: 0,
            height: '80vh',
            width: toggle && toggleNote ? '40vw' : '50vw',
            transform: toggle && toggleNote 
              ? 'translate(-60%, -50%)' 
              : toggle 
                ? 'translate(-80%, -50%)' 
                : 'translate(-50%, -50%)'
          }}
        >
          <Typography variant='h2'>
						Coach Reflections
          </Typography>
          <TextField
            id='outlined-multiline-static'
            label=''
            multiline
            value={content}
            onChange={handleChange}
            placeholder='Enter your feedbacks ...'
            rows={25}
            sx={{
              mt: 2,
              width: '100%',
              '& label.Mui-focused': {
                color: 'black',
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
            onClick={handleOpen}
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
              sx={{color: 'white'}}
            >
							Sample Sentence
            </Button>
            <Button 
              color='primary' 
              onClick={handleClear} 
              variant='contained' 
              disableElevation
              sx={{color: 'white'}}
            >
							Clear
            </Button>
            <LoadingButton
              size='medium'
              onClick={handleAdd}
              loading={isLoading}
              variant='contained'
              color='success'
              disabled={content?.length < 1}
              disableElevation
              sx={{
                color: 'white'
              }}
            >
							Confirm
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

AddReflectionForm.propTypes = {
  playerId: PropTypes.string,
  toggle: PropTypes.bool,
  setToggle: PropTypes.func
};

export default AddReflectionForm;