/* eslint-disable */
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
	Box,
	Modal,
	Button,
	Typography,
	IconButton,
	CircularProgress,
	Stack,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { getPlayerAssessment } from 'global/redux/player/thunk';
import { style, boxStyle } from 'utils/constant/style';
import { convertDate } from 'utils/helper';
import { fetchAssessment } from 'global/redux/player/slice';
const TrainingNote = ({ playerId, playerName, playerAssessmentId }) => {
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const { isLoading, trainingNote, fetchPlayerAssessment } = useSelector(
		({ player }) => ({
			isLoading: player.isLoading,
			trainingNote: player.trainingNote,
			fetchPlayerAssessment: player.fetchPlayerAssessment,
		})
	);
	const { assessmentInfo, eventList } = useSelector(({ assessment }) => ({
		assessmentInfo: assessment.assessmentInfo,
		eventList: assessment.eventList,
	}));

	const handleOpen = useCallback(async () => {
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

	// useEffect(() => {
	//   if (fetchPlayerAssessment !== playerId) {
	//     dispatch(
	//       getPlayerAssessment({
	//         assessmentId: assessmentInfo.id,
	//         playerId,
	//         playerAssessmentId,
	//         eventId: assessmentInfo?.event.map((item) => item.eventID),
	//       })
	//     );
	//     dispatch(fetchAssessment(playerId));
	//   }
	// }, [
	// dispatch,
	// 	playerId,
	// 	assessmentInfo,
	// 	fetchPlayerAssessment,
	// playerAssessmentId,
	// ]);

	console.log(
		playerId,
		assessmentInfo,
		fetchPlayerAssessment,
		playerAssessmentId
	);

	return (
		<div>
			{trainingNote?.length > 0 && <Button onClick={handleOpen}>View</Button>}
			<Modal
				open={open}
				aria-labelledby='parent-modal-title'
				aria-describedby='parent-modal-description'
			>
				<Box
					sx={{
						...style,
						overflow: 'auto',
						outline: 'none',
					}}
				>
					<Typography variant='h2'>
						{`Training note for ${playerName}`}
					</Typography>
					{isLoading ? (
						<Box
							sx={{
								height: '90%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<CircularProgress color='info' />
						</Box>
					) : (
						(trainingNote?.length !== 0 &&
							trainingNote?.map((item, index) => (
								<Box
									key={index}
									sx={{
										...boxStyle,
										maxHeight: '500px',
										overflow: 'auto',
									}}
								>
									<Stack
										direction='row'
										justifyContent='space-between'
										alignItems='center'
									>
										<Typography variant='h4'>
											Manager name:{' '}
											{item?.coachName ||
												'This is testing data, please delete this note and make a new one'}
											<br />
											Updated at: {convertDate(item?.createdAt?.seconds)}
											<br />
											{eventList
												.filter((event) => event.id === item?.eventID)
												.map((event) => event.eventName)[0] || 'Test data'}
										</Typography>
									</Stack>
									<Typography
										sx={{
											fontSize: '16px',
											color: 'black',
											bgcolor: 'background.paper',
											width: '100%',
											wordWrap: 'break-word',
											mt: 3,
										}}
									>
										{item?.content}
									</Typography>
								</Box>
							))) || (
							<Box
								sx={{
									height: '90%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Typography variant='h3' mt={5}>
									No notes currently
								</Typography>
							</Box>
						)
					)}
					<IconButton
						disabled={isLoading}
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

TrainingNote.propTypes = {
	playerId: PropTypes.string,
	playerName: PropTypes.string,
};

export default TrainingNote;
