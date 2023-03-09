import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Box, Modal, Button, Typography, IconButton, CircularProgress, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import AddReflectionForm from './Add';
import EditReflectionForm from './Edit';
import { convertDate } from 'utils/helper';
import { style, boxStyle } from 'utils/constant/style';
import { getPlayerAssessment, deleteCoachReflection } from 'global/redux/player/thunk';
import { fetchAssessment } from 'global/redux/player/slice';

const CoachReflection = ({ playerId, playerName, playerAssessmentId }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [toggleNote, setToggleNote] = useState(false);
  const userInfo = useSelector(({auth}) => auth.userInfo);
  const assessmentInfo = useSelector(({assessment}) => assessment.assessmentInfo);
  const { reflection, isLoading, fetchPlayerAssessment } = useSelector(({player}) => ({
    reflection: player.reflection,
    isLoading: player.isLoading,
    fetchPlayerAssessment: player.fetchPlayerAssessment
  }));

  const handleOpen = useCallback(() => {
    if (fetchPlayerAssessment !== playerId) {
      dispatch(getPlayerAssessment({
        assessmentId: assessmentInfo.id,
        playerId,
        playerAssessmentId,
        eventId: assessmentInfo?.event.map(item => item.eventID)
      }));
      dispatch(fetchAssessment(playerId));
    }
    setOpen(true);
  }, [dispatch, playerId, assessmentInfo, fetchPlayerAssessment, playerAssessmentId]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
	
  const handleDelete = useCallback(() => {
    dispatch(deleteCoachReflection({
      assessmentId: assessmentInfo.id,
      playerAssessmentId,
    }));
  },[assessmentInfo, dispatch, playerAssessmentId]);

  return (
    <>
      <Button onClick={handleOpen}>View</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box 
          sx={{
            ...style,
            display: toggle || toggleNote ? 'none' : '',
            height: '80vh',
            outline: 'none'
          }}
        >
          <Typography variant='h2'>
            {`Reflection for ${playerName}`}
          </Typography>
          <IconButton 
            onClick={handleClose}
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
            isLoading
              ? 
              <Box 
                sx={{
                  height: '90%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress color='info'/>
              </Box>
              :
              <Box
                sx={{
                  height: '88%',
                  overflow: 'auto'
                }}
              >
                {
                  reflection && (
                    <Box 
                      sx={{
                        ...boxStyle,
                        width: '100%',
                        maxHeight: '50%',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}
                    >
												
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='h4'>
														Manager name : {reflection?.coachName}
                          <br/>
														Updated at: {
                            convertDate(reflection?.createdAt?.seconds || reflection?.createdAt)
                          }
                        </Typography>
                        <Stack direction='row' alignItems='center' justifyContent='center' gap={1}>
                          <EditReflectionForm 
                            playerAssessmentId={playerAssessmentId} 
                            data={reflection?.content} 
                            toggle={toggle} 
                            setToggle={setToggle}
                            toggleNote={toggleNote}
                            setToggleNote={setToggleNote}
                          />
                          <IconButton 
                            color='error' 
                            onClick={handleDelete}
                            disabled={userInfo.id !== assessmentInfo.coachID}
                          >
                            <DeleteIcon/>
                          </IconButton>
                        </Stack>
                      </Stack>
                      <Typography mt={3} variant='h5'
                        sx={{
                          bgcolor: 'background.paper',
                          wordWrap: 'break-word',
                          mt: 2,
                          fontSize: 20
                        }}
                      >
                        {reflection?.content}
                      </Typography>
                    </Box>
                  ) || 									
									<Box 
									  sx={{
									    height: '90%',
									    display: 'flex',
									    justifyContent: 'center',
									    alignItems: 'center'
									  }}
									>
									  <Typography variant='h3' mt={5}>
											No notes currently
									  </Typography>
									</Box>
                }
              </Box>
          }
          <Box 
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              mb: 3,
              mr: 3
            }}
          >
            <AddReflectionForm
              playerAssessmentId={playerAssessmentId} 
              toggle={toggle} 
              setToggle={setToggle}
              toggleNote={toggleNote}
              setToggleNote={setToggleNote}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

CoachReflection.propTypes = {
  playerId: PropTypes.string,
  playerName: PropTypes.string
};

export default CoachReflection;