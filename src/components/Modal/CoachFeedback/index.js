import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Modal,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { style, boxStyle } from 'utils/constant/style';
import { getPlayerAssessment } from 'global/redux/player/thunk';
import { fetchAssessment } from 'global/redux/player/slice';
import { convertDate } from 'utils/helper';

const CoachFeedback = ({playerId, playerName, playerAssessmentId}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { isLoading, coachFeedback, fetchPlayerAssessment } = useSelector(({player}) => ({
    isLoading: player.isLoading,
    coachFeedback: player.coachFeedback,
    fetchPlayerAssessment: player.fetchPlayerAssessment
  }));
  const clubList = useSelector(({auth}) => auth.clubList);
  const assessmentInfo = useSelector(({assessment}) => assessment.assessmentInfo);

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
  },[]);

  return (
    <>
      <Button onClick={handleOpen}>View</Button>
      <Modal
        open={open}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ ...style, height: '90vh', overflow: 'auto', outline: 'none' }}>
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
          <Typography variant='h2'>
            {`Coach Feedback for ${playerName}`}
          </Typography>
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
              coachFeedback?.length !== 0 && (
                coachFeedback?.map((item,index) => (
                  <Box 
                    key={index}
                    sx={{
                      ...boxStyle,
                      maxHeight: '500px',
                      overflow: 'auto',
                    }}>
                    <Stack 
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <Typography variant='h4'>
											Manager name: {item?.coachName || 
											'This is testing data, please delete this note and make a new one'}
                        <br />
											Created at: {convertDate(item?.createdAt?.seconds)}
                        <br />
                      From: {
                          clubList.filter(club => club.id === item.clubId).map(club => club.teamName)[0]
                        }
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        bgcolor: 'background.paper',
                        width: '100%',
                        wordWrap: 'break-word',
                        mt: 2,
                        fontSize: '16px',
                        color: 'black'
                      }}
                    >
                      {item?.content}
                    </Typography>
                  </Box>
                ))
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
      </Modal>
    </>
  );
};

export default CoachFeedback;