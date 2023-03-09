import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { getAssessmentDetail } from 'global/redux/assessment/thunk';

const ViewDetails = ({ assessmentId, eventId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = useCallback(() => {
    dispatch(getAssessmentDetail({assessmentId}));
    navigate(`/dashboard/assessment/assessment_id=${assessmentId}/event_id=${eventId}`);
  }, [assessmentId, eventId, dispatch, navigate]);

  return (
    <>
      <Button onClick={handleOpen}>View</Button>
    </>
  );
};

ViewDetails.propTypes = {
  assessmentId: PropTypes.string,
  coachId: PropTypes.string,
  eventId: PropTypes.array,
  coachName: PropTypes.string
};

export default ViewDetails;