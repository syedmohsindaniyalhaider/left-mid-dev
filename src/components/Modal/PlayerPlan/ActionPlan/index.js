import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Modal,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { style, boxStyle } from 'utils/constant/style';
import { getPlayerAssessment } from 'global/redux/player/thunk';
import { fetchAssessment } from 'global/redux/player/slice';

const ActionPlan = ({ playerId, playerAssessmentId }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const assessmentInfo = useSelector(
    ({ assessment }) => assessment.assessmentInfo
  );
  const { selfImprove, isLoading, fetchPlayerAssessment } = useSelector(
    ({ player }) => ({
      selfImprove: player.selfImprove,
      isLoading: player.isLoading,
      fetchPlayerAssessment: player.fetchPlayerAssessment,
    })
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
      {!!selfImprove?.actionPlan && <Button onClick={handleOpen}>View</Button>}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ ...style, outline: 'none' }}>
          <Typography variant='h2'>Action Plan</Typography>
          <Box
            sx={{
              ...boxStyle,
              height: '50vh',
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Typography sx={{ fontSize: '16px', color: 'black' }}>
                {selfImprove?.actionPlan || 'Empty'}
              </Typography>
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

ActionPlan.propTypes = {
  playerId: PropTypes.string,
};

export default ActionPlan;
