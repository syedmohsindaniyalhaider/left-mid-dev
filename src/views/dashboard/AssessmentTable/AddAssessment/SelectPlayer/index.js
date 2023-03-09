import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Button, 
  Modal, 
  Stack,
  CircularProgress,
  Typography
} from '@mui/material';

import PlayerTable from 'components/Table/PlayerTable';
import EmailConfirm from '../../EmailConfirm';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getPlayerFromSelectedEvents, addAssessmentRecord } from 'global/redux/assessment/thunk';
import { showNoti } from 'utils/helper';
import { LoadingButton } from '@mui/lab';

const SelectPlayer = ({ selectedEvent, setToggle, assessmentName = 'New assessment' }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const userInfo = useSelector(({auth}) => auth.userInfo);
  const {currentTeam, playerInEvent, isPlayerLoading, eventList, isAdding} = useSelector(({assessment}) => ({
    currentTeam: assessment.currentTeam,
    playerInEvent: assessment.playerInEvent,
    isPlayerLoading: assessment.isPlayerLoading,
    eventList: assessment.eventList,
    isAdding: assessment.isAdding
  }));

  const handleOpen = async () => {
    setOpen(true);
    dispatch(getPlayerFromSelectedEvents({eventId: selectedEvent, clubId: currentTeam.club}));
  };

  const handleClose = () => {
    setSelected([]);
    setOpen(false);
  };

  const handleConfirm = async () => {
    const res = await dispatch(addAssessmentRecord({
      coachID: userInfo.id,
      coachName: `${userInfo.firstName} ${userInfo.lastName}`,
      teamID: currentTeam.club,
      event: eventList.filter(item => selectedEvent.includes(item.id)).map(item => {
        return {
          eventID: item.id,
          eventName: item.eventName
        };
      }),
      name: assessmentName || 'New assessment',
      playerList: selected
    }));
    if (res.payload.status) {
      handleClose();
      setToggle(false);
      showNoti('success', 'Add successfuly');
    }
  };

  return (
    <>
      <Button
        size='medium'
        onClick={handleOpen}
        variant='contained'
        color='success'
        disabled={selectedEvent.length === 0}
        disableElevation
        endIcon={<ArrowForwardIcon/>}
        sx={{
          color: 'white'
        }}
      >
				Next
      </Button>
      <Modal
        open={open}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        hideBackdrop
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
                    {
                      playerInEvent?.length > 0 
                        ? <PlayerTable data={playerInEvent} selected={selected} setSelected={setSelected}/>
                        : 
                        <Box
                          sx={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Typography variant='h3'>
														No players from this team join these events
                          </Typography>
                        </Box>
                    }
                    
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
                <EmailConfirm chosenPlayer={selected}/>
                <LoadingButton
                  size='medium'
                  onClick={handleConfirm}
                  variant='contained'
                  color='success'
                  disabled={selected.length === 0}
                  disableElevation
                  loading={isAdding}
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

export default SelectPlayer;