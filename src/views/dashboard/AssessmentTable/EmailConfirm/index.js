import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, 
  Modal, 
  Box, 
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import TransferList from 'components/TransferList';
import { showNoti } from 'utils/helper';
import { sendNotifyEmail } from 'services';

const EmailConfirm = ({ chosenPlayer }) =>  {
  const [open, setOpen] = useState(false);
  const [informPlayer, setInformPlayer] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo, totalTeam, clubList } = useSelector(({auth}) => ({
    userInfo: auth.userInfo,
    totalTeam: auth.totalTeam,
    clubList: auth.clubList
  }));
  const { clubCoachesEmail, currentTeam, playerInClub } = useSelector(({assessment}) => ({
    clubCoachesEmail: assessment.clubCoachesEmail,
    currentTeam: assessment.currentTeam,
    playerInClub: assessment.playerInClub
  }));
  const selectedPlayer = chosenPlayer?.map(item => playerInClub.filter(player => player.id === item)[0]);
  const teamName = totalTeam.filter(item => item?.organizeId?.id === currentTeam.organize)
    .map(item => item?.organizeId?.name)[0];
  const clubName = clubList.filter(item => item.id === currentTeam?.club)
    .map(item => `${item?.teamName}-${teamName}-${item?.grade}-${item?.division}`)[0];

  const handleToggle = useCallback(() => {
    setOpen(!open);
    setInformPlayer([]);
  }, [open]);

  const handleSend = async () => {
    try {	
      const combineList = clubCoachesEmail.join(',');
      setLoading(true);
      const res = await sendNotifyEmail({
        dest: combineList,
        coachName: `${userInfo.firstName} ${userInfo.lastName}`,
        teamName: clubName,
        type: 'new',
        content: informPlayer.map(item => item.firstName + ' ' + item.lastName)
      });
      if (res.data.message === 'sent') {
        setOpen(false);
        setLoading(false);
        showNoti('success', 'Mail sent');
      }
    } catch(err) {
      showNoti('error', err.message);
    }
  };

  return (
    <div>
      <Button 
        onClick={handleToggle} 
        variant='contained'
        disableElevation
        startIcon={<NotificationsNoneIcon/>}
        disabled={chosenPlayer?.length === 0}
        sx={{color: 'white'}}
      >
				Notify
      </Button>
      <Modal
        open={open}
        onClose={handleToggle}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              lg: '60vw',
              xl: '55vw',
              xxl: '55vw'
            },
            height: '40vh',
            minHeight: 500,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 10,
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TransferList selectedPlayer={selectedPlayer} right={informPlayer} setRight={setInformPlayer}/>
          <IconButton 
            onClick={handleToggle}
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
          <LoadingButton
            disableElevation
            variant='contained'
            onClick={handleSend}
            loading={loading}
            disabled={informPlayer.length === 0}
            sx={{
              color: 'background.paper',
              position: 'absolute',
              bottom: 0,
              right: 0,
              mb: 3,
              mr: 3
            }}
          >
						Confirm
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
};

export default EmailConfirm;
