import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Button, 
  Modal, 
  Stack,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';

import SelectPlayer from './SelectPlayer';
import CustomTable from 'components/Table';
import { TEAM_TAG } from 'utils/constant';

const AddAssessment = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [assessmentName, setAssessmentName] = useState('');
  const totalTeam = useSelector(({auth}) => auth.totalTeam);
  const { eventList, fetchedEvent, currentTeam } = useSelector(({assessment}) => ({
    eventList: assessment.eventList,
    fetchedEvent: assessment.fetchedEvent,
    currentTeam: assessment.currentTeam
  }));
  const teamType = totalTeam.map(item => item.organizeId).filter(item => item.id === currentTeam.organize)[0];
	
  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => {
    setSelected([]);
    setOpen(false);
  }, []);
	
  return (
    <>
      <LoadingButton 
        disabled={teamType?.tag !== TEAM_TAG}
        loading={fetchedEvent}
        onClick={handleOpen} 
        startIcon={<AssessmentIcon/>} 
        variant='contained' 
        disableElevation
        sx={{
          color: 'background.paper'
        }}
      >
				New Assessment
      </LoadingButton>
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
            boxShadow: 10,
            p: 3,
            outline: 'none'
          }}
        >
          <Stack direction={'column'} sx={{height: '100%'}}>
            {
              eventList?.length > 0 && (
                <>
                  <Box
                    sx={{
                      height: '90%',
                    }}
                  >
                    <CustomTable data={eventList} selected={selected} setSelected={setSelected}/>
                  </Box>
                  <Box>
                    <Stack 
                      direction='row' 
                      justifyContent='space-between' 
                      alignItems='center'                         
                      mt={3}
                      mr={1}
                    >
                      <TextField
                        id='outlined-textarea'
                        label='Assessment Name'
                        value={assessmentName}
                        onChange={(e) => setAssessmentName(e.target.value)}
                        placeholder='"New assessment" if leave empty'
                        sx={{width: 350}}
                      />
                      <Stack
                        direction={'row'} 
                        justifyContent={'flex-end'} 
                        alignItems={'center'} 
                        height={'100%'}
                        gap={3}
                      >
                        <Button variant='contained' disableElevation onClick={handleClose} sx={{color: 'white'}}>
													Cancel
                        </Button>
                        <SelectPlayer selectedEvent={selected} setToggle={setOpen} assessmentName={assessmentName}/>
                      </Stack>
                    </Stack>
                  </Box>
                </>
              ) || (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
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
                  <Typography variant='h3'>
										There are no events for this team currently
                  </Typography>
                </Box>
              )
            }
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default AddAssessment;