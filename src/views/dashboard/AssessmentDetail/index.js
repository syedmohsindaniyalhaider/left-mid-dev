import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Stack,
  Button, 
  Box,
  CircularProgress,
  Typography,
  Divider,
  Checkbox,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';

import { showNoti } from 'utils/helper';
import { sendNotifyEmail } from 'services';
import { PLAYER_TABLE_COLUMNS } from 'utils/constant/style';
import { ActionPlan, CoachReflection, DevelopmentGoal, Psychology, TrainingNote } from 'components/Modal';
import AddPlayer from './AddPlayer';
import AddEvent from './AddEvent';
import { fetchAssessment } from 'global/redux/player/slice';
import { toggleCurrentView, toggleAddEvent } from 'global/redux/assessment/slice';
import CoachFeedback from 'components/Modal/CoachFeedback';
import { LoadingButton } from '@mui/lab';

const AssessmentDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assessmentId, eventId } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const { userInfo, clubList, totalTeam } = useSelector(({auth}) => ({
    userInfo: auth.userInfo,
    clubList: auth.clubList,
    totalTeam: auth.totalTeam
  }));
  // eslint-disable-next-line max-len
  const { playerInAssessment, fetchPlayerInAssessment, assessmentInfo, clubCoachesEmail } = useSelector(({assessment}) => ({
    playerInAssessment: assessment.playerInAssessment,
    fetchPlayerInAssessment: assessment.fetchPlayerInAssessment,
    assessmentInfo: assessment.assessmentInfo,
    clubCoachesEmail: assessment.clubCoachesEmail
  }));
  const teamName = totalTeam.filter((item) => item?.clubInfo.some((club) => club?.clubId === assessmentInfo?.teamID))
    .map(item => item?.organizeId?.name)[0];
  const clubName = clubList.filter(item => item?.id === assessmentInfo?.teamID)
    .map(item => `${item?.teamName}-${teamName}-${item?.grade}-${item?.division}`)[0];
  const selectedPlayerName = playerInAssessment
    .filter(item => selected.includes(item?.userID))
    .map(item => `${item?.userInfo?.firstName} ${item?.userInfo?.lastName}`);

  const handleShowDetail = useCallback((playerId) => {
    navigate(`player_id=${playerId}`);
  }, [navigate]);
	
  const handleClose = useCallback(() => {
    dispatch(fetchAssessment(''));
    dispatch(toggleCurrentView());
    dispatch(toggleAddEvent());
    navigate('/dashboard');
  }, [navigate, dispatch]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }, []);

  const isSelected = useCallback((name) => selected.indexOf(name) !== -1, [selected]);

  const handleClick = useCallback((event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
	
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  }, [selected]);

  const handleSelectAllClick = useCallback((event) => {
    if (event.target.checked) {
      const newSelected = playerInAssessment.map((n) => n.userID);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [playerInAssessment]);

  const handleSendMail = useCallback(async () => {
    try {	
      setLoading(true);
      const combineList = clubCoachesEmail.join(',');
      const res = await sendNotifyEmail({
        dest: combineList,
        coachName: `${userInfo.firstName} ${userInfo.lastName}`,
        teamName: clubName,
        type: 'edit',
        content: [selectedPlayerName]
      });
      if (res.data.message === 'sent') {
        setSelected([]);
        setLoading(false);
        showNoti('success', 'Mail sent');
      }
    } catch(err) {
      showNoti('error', err.message);
    }
  }, [userInfo, clubCoachesEmail, clubName, selectedPlayerName]);

  return (
    <Paper sx={{ height: '100%', overflow: 'hidden' }}>
      {
        fetchPlayerInAssessment
          ?               
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CircularProgress/>
          </Box>
          :
          <>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{
                width: '100%',
                height: 80
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: '75%',
                  pt: 1.5,
                  pl: 2,
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis'
                }}
              >
                <Typography variant='h4' noWrap>
									Assessment: {assessmentInfo?.name}
                  <br/>
									Created By: {assessmentInfo?.coachName}
                  <br/>
                  {assessmentInfo?.event?.map(item => item.eventName).join(', ')}
                </Typography>
              </Box>
              <LoadingButton
                disabled={selected?.length === 0}
                loading={loading}
                loadingPosition='start'
                startIcon={<SendIcon />}
                disableElevation
                variant='contained'
                onClick={handleSendMail}
                sx={{
                  color: 'white',
                  mr: 5, 
                  ml: 1
                }}
              >
								Send
              </LoadingButton>
            </Stack>
            <Divider sx={{ borderBottomWidth: 2 }} />
            <TableContainer sx={{height: '69vh', overflow: 'auto'}}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell padding='checkbox'>
                      <Checkbox
                        color='primary'
                        indeterminate={selected?.length > 0 && selected?.length < playerInAssessment?.length}
                        checked={playerInAssessment?.length > 0 && selected?.length === playerInAssessment?.length}
                        onChange={handleSelectAllClick}
                        inputProps={{
                          'aria-label': 'select all desserts',
                        }}
                      />
                    </TableCell>
                    {PLAYER_TABLE_COLUMNS.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playerInAssessment
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((row, index) => {
                      const isItemSelected = isSelected(row.userID);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow          
                          hover
                          onClick={(event) => handleClick(event, row.userID)}
                          role='checkbox'
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={index}
                          selected={isItemSelected}
                          sx={{
                            cursor: 'pointer'
                          }}
                        >
                          <TableCell padding='checkbox'>
                            <Checkbox
                              color='primary'
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>

                          <TableCell align='left'>
                            <Stack 
                              onClick={() => handleShowDetail(row?.userID)}
                              direction={'row'} 
                              justifyContent='flex-start' 
                              alignItems={'center'} 
                              gap={3} 
                              sx={{
                                width: 'max-content',
                                cursor: 'pointer'
                              }}
                            >
                              <Avatar src={row?.userInfo?.profilePhoto} alt={'player avatar'}/>
                              {`${row?.userInfo?.firstName} ${row?.userInfo?.lastName}`}
                              <InfoIcon color='info' fontSize='small'/>
                            </Stack>
                          </TableCell>

                          <TableCell align='center'>
                            {row?.userInfo?.preferredPosition}
                          </TableCell>

                          <TableCell align='center'>
                            <TrainingNote 
                              playerId={row?.userID}
                              playerAssessmentId={row?.id}
                              playerName={`${row?.userInfo?.firstName} ${row?.userInfo?.lastName}`}
                            />
                          </TableCell>

                          <TableCell align='center'>
                            <Psychology 
                              playerId={row?.userID} 
                              playerAssessmentId={row?.id}
                              playerName={`${row?.userInfo.firstName} ${row?.userInfo?.lastName}`}
                            />
                          </TableCell>

                          <TableCell align='center'>
                            <CoachReflection 
                              playerId={row?.userID} 
                              playerAssessmentId={row?.id}
                              playerName={`${row?.userInfo.firstName} ${row?.userInfo?.lastName}`}
                            />
                          </TableCell>

                          <TableCell align='center'>
                            <CoachFeedback
                              playerId={row?.userID}
                              playerAssessmentId={row?.id}
                              playerName={`${row?.userInfo.firstName} ${row?.userInfo?.lastName}`}
                            />
                          </TableCell>

                          <TableCell align='center'>
                            <DevelopmentGoal playerId={row?.userID} playerAssessmentId={row?.id}/>
                          </TableCell>

                          <TableCell align='center'>
                            <ActionPlan playerId={row?.userID} playerAssessmentId={row?.id}/>
                          </TableCell>

                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Stack
                direction='row'
                justifyContent='center'
                alignItems='center'
                gap={3}
                ml={3}
              >
                <Button onClick={handleClose} disableElevation variant='contained' 
                  sx={{
                    color: 'white'
                  }}
                >
									Back
                </Button>
                <AddPlayer eventId={eventId.split(',')} assessmentId={assessmentId}/>
                <AddEvent assessmentId={assessmentId} teamId={assessmentInfo.teamID}/>
              </Stack>
              <TablePagination
                rowsPerPageOptions={[10, 50, 100, { label: 'All', value: -1 }]}
                component='div'
                count={playerInAssessment.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  mr: 3
                }}
              />
            </Box>
          </>
      }
    </Paper>
  );
};

export default AssessmentDetail;