import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Button, 
  Modal, 
  Stack,
  CircularProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import PlayerTable from 'components/Table/PlayerTable';
import { addPlayerToAssessment, getPlayerFromSelectedEvents } from 'global/redux/assessment/thunk';
import { showNoti } from 'utils/helper';
import { toggleCurrentView } from 'global/redux/assessment/slice';

const AddPlayer = ({eventId}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const { 
    playerInEvent, 
    playerInAssessment, 
    isPlayerLoading, 
    assessmentInfo,
    currentView
  } = useSelector(({assessment}) => ({
    playerInEvent: assessment.playerInEvent, 
    playerInAssessment: assessment.playerInAssessment,
    isPlayerLoading: assessment.isPlayerLoading,
    assessmentInfo: assessment.assessmentInfo,
    currentView: assessment.currentView
  }));
  const userInfo = useSelector(({auth}) => auth.userInfo);
  const data = playerInEvent.filter(item => !playerInAssessment.map(player => player.userID).includes(item.id));
	
  const handleOpen = useCallback(async () => {
    setOpen(true);
    if (!currentView) {
      dispatch(getPlayerFromSelectedEvents({
        eventId: eventId,
        clubId: assessmentInfo.teamID
      }));
      dispatch(toggleCurrentView());
    }
  }, [assessmentInfo, dispatch, eventId, currentView]);

  const handleClose = useCallback(() => {
    setSelected([]);
    setOpen(false);
  }, []);

  const handleConfirm = useCallback( async () => {
    setLoading(true);
    const res = await dispatch(addPlayerToAssessment({
      assessmentId: assessmentInfo?.id,
      playerId: selected,
      coachName: userInfo?.displayName
    }));
    if (res.payload.status) {
      showNoti('success', 'Add player success');
      setLoading(false);
      handleClose();
    }
  }, [assessmentInfo, dispatch, selected, userInfo, handleClose]);

  return (
    <>
      <Button 
        disableElevation 
        disabled={assessmentInfo.coachID !== userInfo.id}
        variant='contained' 
        onClick={handleOpen}
        sx={{
          color: 'white'
        }}
      >
				Add new player
      </Button>
      <Modal
        open={open}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            height: '90vh',
            minHeight: '870px',
            maxHeight: '930px',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Stack direction={'column'} sx={{height: '100%'}}>
            {
              isPlayerLoading
                ? 
                <Box 
                  sx={{
                    width: '100%', 
                    height: '90%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    'alignItems': 'center'}}
                >
                  <CircularProgress/>
                </Box>
                :
                <>
                  <Box
                    sx={{
                      height: '90%',
                    }}
                  >
                    <PlayerTable data={data} selected={selected} setSelected={setSelected}/>
                  </Box>
                </>
            }
            <Box>
              <Stack
                mt={3}
                mr={1}
                direction={'row'} 
                justifyContent={'flex-end'} 
                alignItems={'center'} 
                height={'100%'}
                gap={3}
              >
                <Button variant='contained' disableElevation onClick={handleClose} sx={{color: 'white'}}>
									Back
                </Button>
                <LoadingButton
                  size='medium'
                  onClick={handleConfirm}
                  variant='contained'
                  color='success'
                  disabled={selected.length === 0}
                  disableElevation
                  loading={loading}
                  sx={{
                    color: 'white'
                  }}
                >
									Confirm
                </LoadingButton>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default AddPlayer;