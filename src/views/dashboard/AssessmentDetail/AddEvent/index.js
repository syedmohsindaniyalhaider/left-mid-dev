import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Box, 
  Modal, 
  Stack,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import CustomTable from 'components/Table';
import { getTeamEventLists, addEventToAssessment } from 'global/redux/assessment/thunk';
import { toggleAddEvent } from 'global/redux/assessment/slice';

const AddEvent = ({teamId, assessmentId}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(({auth}) => auth.userInfo);
  const { eventList, fetchedEvent, addingEvent, assessmentInfo } = useSelector(({assessment}) => ({
    eventList: assessment.eventList,
    fetchedEvent: assessment.fetchedEvent,
    addingEvent: assessment.addingEvent,
    assessmentInfo: assessment.assessmentInfo
  }));
  const data =  eventList?.filter(data => !assessmentInfo?.event?.map(item => item.eventID)?.includes(data.id)); 

  const handleOpen = useCallback(() => {
    if (!addingEvent) {
      dispatch(getTeamEventLists(teamId));
      dispatch(toggleAddEvent());
    }
    setOpen(true);
  }, [dispatch, teamId, addingEvent]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelected([]);
  }, []);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    const res = await dispatch(addEventToAssessment({
      assessmentId: assessmentId,
      event: eventList.filter(item => selected.includes(item.id)).map(item => {
        return {
          eventID: item.id,
          eventName: item.eventName
        };
      })
    }));
    if (res.payload.status) {
      const newEvent = assessmentInfo?.event.map(item => item.eventID);
      setLoading(false);
      handleClose();
      navigate(
        `/dashboard/assessment/assessment_id=${assessmentId}/event_id=${newEvent}`
      );
    }
  }, [navigate, assessmentInfo, dispatch, assessmentId, selected, handleClose, eventList]);

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
				Add events
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
            minHeight: '850px',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Stack direction={'column'} sx={{height: '100%'}}>
            {
              fetchedEvent
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
                    <CustomTable data={data} selected={selected} setSelected={setSelected}/>
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

export default AddEvent;