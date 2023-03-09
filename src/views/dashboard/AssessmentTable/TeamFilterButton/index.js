import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Typography
} from '@mui/material';

import { getTeamEventLists, getCoachesMail, getAssessmentRecords } from 'global/redux/assessment/thunk';
import { getPlayerByClub } from 'global/redux/auth/thunk';
import { chooseTeam, resetAssessment, resetEventList } from 'global/redux/assessment/slice';
import { TEAM_TAG } from 'utils/constant';

const FilterTeamButton = () => {
  const dispatch = useDispatch();
  const { totalTeam, isLoading, clubList, isLogin } = useSelector(({auth}) => ({
    totalTeam: auth.totalTeam,
    isLoading: auth.isLoading,
    clubList: auth.clubList,
    isLogin: auth.isLogin
  }));
  const currentTeam = useSelector(({assessment}) => assessment.currentTeam);
  const [team, setTeam] = useState(currentTeam?.organize || '');
  const [club, setClub] = useState(currentTeam?.club || '');
  const teamType = totalTeam.map(item => item.organizeId).filter(item => item.id === team)[0];
  const clubType = clubList.filter(item => item?.id === club)[0];

  const handleChangeTeam = (event) => {
    setTeam(event?.target?.value);
    localStorage.setItem('teamId', event?.target?.value);
    dispatch(chooseTeam({
      team: '',
      club: '',
      players: [],
      teamName: ''
    }));
    setClub('');
    if (event.target.value) {
      setTeam(event.target.value);
      dispatch(resetAssessment());
    }
  };
	
  const handleChangeClub = (event) => {
    setClub(event.target.value);
    if (event.target.value) {
      setClub(event.target.value);
      dispatch(resetEventList());
      dispatch(resetAssessment());
    }
  };

  useEffect(() => {
    if (teamType?.tag === 'MVFC' && club && isLogin) {
      dispatch(getTeamEventLists(clubType.id));
      dispatch(getCoachesMail(clubType.id));
      dispatch(getAssessmentRecords(clubType.id));
    }
  }, [clubType, dispatch, teamType, club, isLogin]);

  useEffect(() => {
    if ( club?.length !== 0 && team?.length !== 0 && isLogin) {
      const players = totalTeam
        .filter(item => item?.organizeId?.id === team)[0]?.clubInfo
        .filter(item => item?.clubId === club)[0]?.playerId;
      const teamName = clubList.filter(info => info.id === club).map(item => item.teamName || item.id)[0];
      dispatch(chooseTeam({team, club, players, teamName}));
      dispatch(getPlayerByClub([...players]));
    }
  }, [totalTeam, dispatch, club, team, clubList, isLogin]);

  return (
    <Stack direction='row' sx={{mb: 3, overflow: 'hidden', height: 80}} alignItems='center'>
      <FormControl sx={{ m: 1, minWidth: 250 }}>
        <Select
          value={team}
          onChange={handleChangeTeam}
          displayEmpty
          disabled={isLoading}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value=''>
						Select Club
          </MenuItem>
          {
            totalTeam?.map((item, index) => (
              <MenuItem key={index} value={item?.organizeId?.id}>
                <Stack
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  gap={1}
                >
                  <Avatar alt='team flag' src={item?.organizeId?.flag} sx={{width: 30, height: 30}}/>
                  {item?.organizeId?.name}
                </Stack>
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }} disabled={!team}>
        <Select
          value={club}
          onChange={handleChangeClub}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value=''>
            Select Team
          </MenuItem>
          {
            totalTeam?.filter(item => item.organizeId.id === team)[0]?.clubInfo
              .map(item => clubList.filter(club => club?.id === item?.clubId)[0]).map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.teamName || `Team ${index + 1}`}
                </MenuItem>
              ))
          }
        </Select>
      </FormControl>
      {
        team && teamType?.tag !== TEAM_TAG && (
          <Typography color='error'>
						Not MFVC
          </Typography>
        )
      }
    </Stack>
  );
};

export default FilterTeamButton;