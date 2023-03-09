import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Select, MenuItem, FormControl, Stack, Typography } from '@mui/material';

import { toCappitalize } from 'utils/helper';
import { updatePlayerPsychology } from 'global/redux/player/thunk';

const SelectionButton = ({label, defaultValue, assessmentId, playerAssessmentId}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(defaultValue || '');
  const MENU_OPTIONS = ['excellent', 'good', 'ok', 'poor'];
  const userInfo = useSelector(({auth}) => auth.userInfo);
  const assessmentInfo = useSelector(({assessment}) => assessment.assessmentInfo);

  const handleChange = useCallback((event) => {
    if (event.target.value) {
      setValue(event.target.value);
      dispatch(updatePlayerPsychology({ assessmentId, playerAssessmentId, value: event.target.value, label}));
    }
  }, [assessmentId, label, dispatch, playerAssessmentId]);

  const header = useMemo(() => {
    const labelList = [
      {
        key: 'attitude',
        value: 'Attitude'
      },
      {
        key: 'coachability',
        value: 'Coachability'
      },
      {
        key: 'intensity',
        value: 'Intensity'
      },
      {
        key: 'concentration',
        value: 'Concentration, Focus'
      }
    ];
    return labelList.filter(item => item.key === label).map(item => item.value);
  }, [label]);

  return (
    <div>
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Typography 
          variant='h4'
        >
          {header}
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 150 }} disabled={userInfo?.id !== assessmentInfo.coachID}>
          <Select
            value={value}
            onChange={handleChange}
            displayEmpty
            renderValue={() => toCappitalize(value)}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={''}>
							Select your choice
            </MenuItem>
            {
              MENU_OPTIONS.map(item => (
                <MenuItem 
                  key={item} 
                  value={item} 
                  sx={{textTransform: 'capitalize'}}
                >
                  {item}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Stack>
    </div>
  );
};

SelectionButton.propTypes = {
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  assessmentId: PropTypes.string,
  playerId: PropTypes.string
};

export default SelectionButton;