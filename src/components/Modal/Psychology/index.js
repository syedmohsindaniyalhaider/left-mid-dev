import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  Box,
  Modal,
  Button,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { getPlayerAssessment } from 'global/redux/player/thunk';
import { fetchAssessment } from 'global/redux/player/slice';
import SelectionButton from 'components/ButtonList';
import { style } from 'utils/constant/style';

const Psychology = ({ playerId, playerAssessmentId }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { psychology, isLoading, fetchPlayerAssessment } = useSelector(
    ({ player }) => ({
      psychology: player.psychology,
      isLoading: player.isLoading,
      fetchPlayerAssessment: player.fetchPlayerAssessment,
    })
  );
  const assessmentInfo = useSelector(
    ({ assessment }) => assessment.assessmentInfo
  );

  const handleOpen = useCallback(() => {
    if (fetchPlayerAssessment !== playerId) {
      dispatch(
        getPlayerAssessment({
          assessmentId: assessmentInfo.id,
          playerId,
          playerAssessmentId,
          eventId: assessmentInfo?.event.map((item) => item.eventID),
        })
      );
      dispatch(fetchAssessment(playerId));
    }
    setOpen(true);
  }, [
    dispatch,
    playerId,
    assessmentInfo,
    fetchPlayerAssessment,
    playerAssessmentId,
  ]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div>
      {psychology?.attitude ? (
        <Button onClick={handleOpen}>Edit</Button>
      ) : (
        <Button onClick={handleOpen}>Check</Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box
          sx={{
            ...style,
            outline: 'none',
            width: {
              xs: '80vw',
              sm: '60vw',
              md: '35vw',
            },
            minWidth: {
              md: '500px',
            },
            height: '47vh',
            display: 'flex',
            justifyContent: 'space-between',
          }}
          xs={{ width: '50vw' }}
        >
          <Typography
            variant='h2'
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              mt: 3,
              ml: 3,
            }}
          >
						Psychology Status
          </Typography>
          <Box
            sx={{
              mt: 7,
              width: '100%',
              height: '100%',
              overflow: 'auto',
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alginItems: 'center',
                  mt: 15,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Stack
                mb={3}
                sx={{
                  border: '1px solid black',
                  borderRadius: '10px',
                  p: '10px 25px',
                }}
              >
                <SelectionButton
                  label='attitude'
                  defaultValue={psychology?.attitude}
                  playerAssessmentId={playerAssessmentId}
                  assessmentId={assessmentInfo.id}
                />
                <SelectionButton
                  label='concentration'
                  defaultValue={psychology?.concentration}
                  playerAssessmentId={playerAssessmentId}
                  assessmentId={assessmentInfo.id}
                />
                <SelectionButton
                  label='intensity'
                  defaultValue={psychology?.intensity}
                  playerAssessmentId={playerAssessmentId}
                  assessmentId={assessmentInfo.id}
                />
                <SelectionButton
                  label='coachability'
                  defaultValue={psychology?.coachability}
                  playerAssessmentId={playerAssessmentId}
                  assessmentId={assessmentInfo.id}
                />
              </Stack>
            )}
          </Box>
          <IconButton
            onClick={handleClose}
            color='error'
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              mt: 2,
              mr: 3,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>
    </div>
  );
};

Psychology.propTypes = {
  playerId: PropTypes.string,
};

export default Psychology;
