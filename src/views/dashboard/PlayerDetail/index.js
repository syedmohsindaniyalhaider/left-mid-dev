import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@mui/styles';
import {
	Stack,
	Box,
	Avatar,
	Typography,
	Divider,
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableHead,
	TableBody,
	Paper,
	Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { toCappitalize } from 'utils/helper';
import {
	getPlayerSelfImprove,
	getPlayerSkillStat,
	getPlayerReflection,
	updatePlayerSkills,
} from 'global/redux/player/thunk';
import RadarChart from 'components/RadarChart';
import Loading from 'components/Loadable/Loading';

const useStyles = makeStyles(() => ({
	root: {},
	lv1: {
		backgroundColor: '#FCEBCD',
	},
	lv2: {
		backgroundColor: '#FBD89B',
	},
	lv3: {
		backgroundColor: '#CDFCEB',
	},
	lv4: {
		backgroundColor: '#FCD3CD',
	},
	lv5: {
		backgroundColor: '#FBA89B',
	},
	tableBorder: {
		borderWidth: 0,
		borderRightWidth: 1,
		borderBottomWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
	},
	bgTransparent: {
		backgroundColor: 'transparent',
		border: 'none',
	},
}));

const PlayerDetail = () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { playerId, assessmentId } = useParams();
	const { isLoading, selfImprove, selfImproveLoading, reflection, psychology } =
		useSelector(({ player }) => ({
			isLoading: player.isLoading,
			selfImprove: player.selfImprove,
			selfImproveLoading: player.selfImproveLoading,
			reflection: player.reflection,
			psychology: player.psychology,
		}));
	const { playerSkillRating } = useSelector((state) => state.player);
	const { playerInAssessment } = useSelector(({ assessment }) => assessment);
	const data = playerInAssessment.filter(
		(item) => item?.userID === playerId
	)[0];
	const [skill, setSkill] = useState({
		skill_1: 'Striking the Ball',
		score_1: 0,
		skill_2: 'Receiving (Awareness)',
		score_2: 0,
		skill_3: 'Keep the ball (Evasion)',
		score_3: 0,
		skill_4: '1v1 Defending',
		score_4: 0,
		skill_5: '1v1 Attacking',
		score_5: 0,
		skill_6: 'Running with the Ball',
		score_6: 0,
		skill_7: 'Proactive Defending',
		score_7: 0,
	});

	const handleBack = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	const playerSkillHandler = () => {
		dispatch(
			updatePlayerSkills({
				skill: skill,
				assessmentId: assessmentId,
				playerAssessmentId: data.id,
			})
		);

		setTimeout(() => {
			dispatch(
				getPlayerReflection({
					assessmentId,
					playerAssessmentId: data.id,
				})
			);
		}, 4000);
	};

	useEffect(() => {
		dispatch(
			getPlayerReflection({
				assessmentId,
				playerAssessmentId: data.id,
			})
		);
		dispatch(getPlayerSelfImprove({ playerAssessmentId: data.id }));
		dispatch(
			getPlayerSkillStat({
				teamId: localStorage.getItem('teamId'),
				playerId: playerId,
			})
		);
	}, [dispatch, data, assessmentId, playerId]);

	useEffect(() => {
		setSkill({
			skill_1: 'Striking the Ball',
			score_1: playerSkillRating['Striking the Ball'],
			skill_2: 'Receiving (Awareness)',
			score_2: playerSkillRating['Receiving (Awareness)'],
			skill_3: 'Keep the ball (Evasion)',
			score_3: playerSkillRating['Keep the ball (Evasion)'],
			skill_4: '1v1 Defending',
			score_4: playerSkillRating['1v1 Defending'],
			skill_5: '1v1 Attacking',
			score_5: playerSkillRating['1v1 Attacking'],
			skill_6: 'Running with the Ball',
			score_6: playerSkillRating['Running with the Ball'],
			skill_7: 'Proactive Defending',
			score_7: playerSkillRating['Proactive Defending'],
		});
	}, [playerSkillRating]);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<Stack
					direction='column'
					sx={{
						bgcolor: 'background.paper',
						width: '100%',
						height: 'auto',
						borderRadius: 3,
					}}
				>
					<Stack
						direction='row'
						justifyContent='center'
						sx={{
							height: {
								md: '300px',
								lg: '350px',
							},
						}}
					>
						<Box
							flex={{
								md: 1.5,
								lg: 1,
							}}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 2,
							}}
						>
							<Avatar
								src={data?.userInfo?.profilePhoto}
								alt={'player avatar'}
								sx={{
									width: {
										md: 200,
										lg: 250,
									},
									height: {
										md: 200,
										lg: 250,
									},
								}}
							/>
							<Typography variant='h4'>
								{`Height: ${data?.userInfo?.height}cm`}
								<br />
								{`Preferred Foot: ${data?.userInfo?.preferredFoot}`}
							</Typography>
						</Box>
						<Stack flex={4} direction='column'>
							<Stack
								direction='row'
								sx={{ mt: 3, mr: 3 }}
								justifyContent='flex-end'
							>
								<Button
									onClick={handleBack}
									color='info'
									startIcon={<ArrowBackIcon />}
									disableElevation
									variant='outlined'
								>
									Back
								</Button>
							</Stack>
							<Stack
								flex={1}
								direction='row'
								justifyContent='center'
								alignItems='center'
							>
								<Divider sx={{ width: '100%' }}>
									<Typography variant='h2'>
										{`${data.userInfo.firstName} ${data.userInfo.lastName}`}
									</Typography>
								</Divider>
							</Stack>
							<Stack
								flex={4}
								direction={'column'}
								gap={1}
								sx={{
									overflow: 'auto',
									borderBottom: '0.5px solid grey',
								}}
							>
								<Typography variant='h3'>Coaches Reflections</Typography>
								<Box
									sx={{
										height: '100%',
										overflow: 'auto',
									}}
								>
									<Typography variant='p'>
										{reflection?.content || 'Empty'}
									</Typography>
								</Box>
								<Divider />
							</Stack>
						</Stack>
					</Stack>
					<Stack
						direction='row'
						justifyContent='space-between'
						sx={{
							mt: 5,
							mb: 5,
							height: '15%',
						}}
					>
						<Box
							flex={1}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 0.5,
							}}
						>
							<Typography variant='h4'>ATTITUDE</Typography>
							<Typography variant='subtitle2'>
								{'[ Determination, Willingness, Passion ]'}
							</Typography>
							<Typography variant='subtitle1'>
								{toCappitalize(psychology?.attitude) || 'None'}
							</Typography>
						</Box>

						<Box
							flex={1}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 0.5,
							}}
						>
							<Typography variant='h4'>CONCENTRATION / FOCUS</Typography>
							<Typography variant='subtitle2'>
								{'[ Listens, Asks & Answers Questions ]'}
							</Typography>
							<Typography variant='subtitle1'>
								{toCappitalize(psychology?.concentration) || 'None'}
							</Typography>
						</Box>

						<Box
							flex={1}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 0.5,
							}}
						>
							<Typography variant='h4'>INTENSITY</Typography>
							<Typography variant='subtitle2'>
								{'[ Enthusiastic, Energy, Work rate ]'}
							</Typography>
							<Typography variant='subtitle1'>
								{toCappitalize(psychology?.intensity) || 'None'}
							</Typography>
						</Box>

						<Box
							flex={1}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 0.5,
							}}
						>
							<Typography variant='h4'>COACHABILITY</Typography>
							<Typography variant='subtitle2'>
								{'[ Respectful, Confident, Character ]'}
							</Typography>
							<Typography variant='subtitle1'>
								{toCappitalize(psychology?.coachability) || 'None'}
							</Typography>
						</Box>
					</Stack>
					<Box sx={{ p: '0 30px' }}>
						<Divider
							sx={{
								'&::before, &::after': {
									borderColor: 'primary.dark',
								},
							}}
						>
							<Typography variant='h2'>Player reflections</Typography>
						</Divider>
					</Box>
					<Stack
						direction={'row'}
						justifyContent='space-between'
						sx={{
							minHeight: '300px',
							maxHeight: '500px',
							overflow: 'auto',
							padding: '20px',
						}}
					>
						{selfImproveLoading ? (
							<Box sx={{ height: 150, width: '100%' }}>
								<Loading />
							</Box>
						) : (
							<>
								<Stack
									direction={'column'}
									gap={5}
									sx={{
										width: '49%',
										overflow: 'auto',
									}}
								>
									<Stack gap={1}>
										<Typography variant='h3'>
											What do you see your strengths are ?
										</Typography>
										<Typography variant='p'>
											{selfImprove?.strengths || 'Empty'}
										</Typography>
									</Stack>
									<Stack gap={1}>
										<Typography variant='h3'>
											What are the 1 or 2 areas that you want to improve upon ?
										</Typography>
										<Typography variant='p'>
											{selfImprove?.wannaImprove || 'Empty'}
										</Typography>
									</Stack>
								</Stack>
								<Divider variant='middle' flexItem orientation='vertical' />
								<Stack
									sx={{
										width: '49%',
										overflow: 'auto',
									}}
									gap={5}
								>
									<Stack gap={1}>
										<Typography variant='h3'>
											Players Development Goal
										</Typography>
										<Typography variant='p'>
											{selfImprove?.developmentGoal || 'Empty'}
										</Typography>
									</Stack>
									<Stack gap={1}>
										<Typography variant='h3'>Players Action plan</Typography>
										<Typography variant='p'>
											{selfImprove?.actionPlan || 'Empty'}
										</Typography>
									</Stack>
								</Stack>
							</>
						)}
					</Stack>
					<Box sx={{ p: '0 30px' }}>
						<Divider
							sx={{
								'&::before, &::after': {
									borderColor: 'primary.dark',
								},
							}}
						>
							<Typography variant='h2'>Skills</Typography>
						</Divider>

						<Stack
							// sx={{
							//   width: '49%',
							// }}
							// alignSelf= 'center'
							// gap={1}
							direction={'row'}
						>
							<RadarChart playerSkillRating={playerSkillRating} />
							<Stack
								direction='row'
								justifyContent='space-between'
								sx={{ p: 3 }}
							>
								{/*<Box 
                sx={{
                  width: {
                    md: '350px',
                    lg: '450px'
                  }, 
                  height: {
                    md: '350px',
                    lg: '450px'
                  }, 
                }}
              >
                Chart wip
              </Box>*/}
								<Box
									sx={{
										//width: {
										//  md: '60%',

										//  lg: '70%'
										//}
										width: '100%',
									}}
								>
									<TableContainer component={Paper} sx={{ borderRadius: 0 }}>
										<Table
											sx={{
												tableLayout: 'auto',
												borderCollapse: 'collapse',
												border: '1px solid black',
												borderBottom: '1.5px solid black',
											}}
										>
											<TableHead>
												<TableRow>
													<TableCell
														align='center'
														className={classes.tableBorder}
													>
														TOPIC
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder}`}
													>
														Level 1 (&gt;0)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder}`}
													>
														Level 2 (&gt;20)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder}`}
													>
														Level 3 (&gt;40)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder}`}
													>
														Level 4 (&gt;60)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder}`}
													>
														Level 5 (&gt;80)
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow>
													<TableCell
														align='center'
														className={`${classes.tableBorder}`}
													>
														<b>Striking the Ball</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Striking the Ball'] === 20 &&
															classes.lv1
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_1: 20 }));
															playerSkillHandler();
														}}
													>
														Passes the ball under 5m &ldquo;<b>cleanly</b>
														&rdquo; (firm, flat, accurate)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Striking the Ball'] === 40 &&
															classes.lv1
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_1: 40 }));
															playerSkillHandler();
														}}
													>
														Passes the ball to 10m &ldquo;<b>cleanly</b>&rdquo;
														(firm, flat, accurate)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Striking the Ball'] === 60 &&
															classes.lv1
														} `}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_1: 60 }));
															playerSkillHandler();
														}}
													>
														Strikes the ball with <b>weaker foot</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Striking the Ball'] === 80 &&
															classes.lv1
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_1: 80 }));
															playerSkillHandler();
														}}
													>
														Can accurately strike the ball in <b>the air</b>{' '}
														(&gt;15m)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Striking the Ball'] === 100 &&
															`${classes.lv1}`
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_1: 100 }));
															playerSkillHandler();
														}}
													>
														Can strike the ball with <b>different</b> surfaces,
														spins and with disguise
													</TableCell>
												</TableRow>

												<TableRow>
													<TableCell
														align='center'
														className={classes.tableBorder}
													>
														<b>Receiving</b> <br /> <b>(Awareness)</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Receiving (Awareness)'] ===
																20 && classes.lv2
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_2: 20 }));
															playerSkillHandler();
														}}
													>
														<b>Moves</b> to effective spaces before receiving
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Receiving (Awareness)'] ===
																40 && classes.lv2
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_2: 40 }));
															playerSkillHandler();
														}}
													>
														Show a good <b>awareness</b> of surroundings (scans)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Receiving (Awareness)'] ===
																60 && classes.lv2
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_2: 60 }));
															playerSkillHandler();
														}}
													>
														Receives with an open <b>body shape</b> (can see 3/4
														of the field)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Receiving (Awareness)'] ===
																80 && classes.lv2
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_2: 80 }));
															playerSkillHandler();
														}}
													>
														<b>Communicates</b> before receiving (verbal /
														non-verbal)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Receiving (Awareness)'] ===
																100 && classes.lv2
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_2: 100 }));
															playerSkillHandler();
														}}
													>
														Takes <b>1st touch</b> into good spaces / away from
														a defender
													</TableCell>
												</TableRow>

												<TableRow>
													<TableCell
														align='center'
														className={classes.tableBorder}
													>
														<b>Keep the ball</b> <br /> <b>(Evasion)</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Keep the ball (Evasion)'] ===
																20 && classes.lv3
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_3: 20 }));
															playerSkillHandler();
														}}
													>
														Displays good <b>close control</b> of the ball
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Keep the ball (Evasion)'] ===
																40 && classes.lv3
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_3: 40 }));
															playerSkillHandler();
														}}
													>
														Uses <b>both feet and fiffrent surfaces</b> to live
														on the ball
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Keep the ball (Evasion)'] ===
																60 && classes.lv3
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_3: 60 }));
															playerSkillHandler();
														}}
													>
														Changes <b>directions & speed</b> to evade defender
														(feints, disguise)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Keep the ball (Evasion)'] ===
																80 && classes.lv3
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_3: 80 }));
															playerSkillHandler();
														}}
													>
														Uses <b>body</b> to protect the ball from the
														defender
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Keep the ball (Evasion)'] ===
																100 && classes.lv3
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_3: 100 }));
															playerSkillHandler();
														}}
													>
														Can successfully <b>escape</b> a defender to then
														make next action (pass, shot, dribble etc)
													</TableCell>
												</TableRow>

												<TableRow>
													<TableCell
														align='center'
														className={classes.tableBorder}
													>
														<b>1v1 Defending</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Defending'] === 20 &&
															classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_4: 20 }));
															playerSkillHandler();
														}}
													>
														Applies effective <b>pressure</b> on the ball
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Defending'] === 40 &&
															classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_4: 40 }));
															playerSkillHandler();
														}}
													>
														Uses body well to force/show a <b>direction</b> to
														the attacker
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Defending'] === 60 &&
															classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_4: 60 }));
															playerSkillHandler();
														}}
													>
														Exhibits good <b>body shape</b> (side on, low,
														balanced)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Defending'] === 80 &&
															classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_4: 80 }));
															playerSkillHandler();
														}}
													>
														Shows controlled <b>aggression and timing</b> when
														making a challenge at the ball
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Defending'] === 100 &&
															classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_4: 100 }));
															playerSkillHandler();
														}}
													>
														<b>&rdquo;Doesn&lsquo;t get beaten&ldquo;</b> easily
													</TableCell>
												</TableRow>

												<TableRow>
													<TableCell
														align='center'
														className={classes.tableBorder}
													>
														<b>1v1 Attacking</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Attacking'] === 20 &&
															classes.lv5
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_5: 20 }));
															playerSkillHandler();
														}}
													>
														Choses to <b>&ldquo;take the defender on&rdquo;</b>{' '}
														(decision)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Attacking'] === 40 &&
															classes.lv5
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_5: 40 }));
															playerSkillHandler();
														}}
													>
														Uses <b>both feet</b> when attacking the defender
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Attacking'] === 60 &&
															classes.lv5
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_5: 60 }));
															playerSkillHandler();
														}}
													>
														Changes <b>speed & direction</b> or uses feints to
														go past the defender
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Attacking'] === 80 &&
															classes.lv5
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_5: 80 }));
															playerSkillHandler();
														}}
													>
														Has a <b>signature move</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['1v1 Attacking'] === 100 &&
															classes.lv5
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_5: 100 }));
															playerSkillHandler();
														}}
													>
														Can consistently <b>get past a defender</b> to
														complete next action (pass, shot, cross etc)
													</TableCell>
												</TableRow>

												<TableRow>
													<TableCell
														align='center'
														className={classes.tableBorder}
													>
														<b>Running with the Ball</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Running with the Ball'] ===
																20 && classes.lv1
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_6: 20 }));
															playerSkillHandler();
														}}
													>
														Keeps ball under <b>control</b> at all times
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Running with the Ball'] ===
																40 && classes.lv1
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_6: 40 }));
															playerSkillHandler();
														}}
													>
														<b>Moves quickly</b> with the ball
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Running with the Ball'] ===
																60 && classes.lv1
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_6: 60 }));
															playerSkillHandler();
														}}
													>
														Can travel fast while using <b>both feed</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Running with the Ball'] ===
																80 && classes.lv1
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_6: 80 }));
															playerSkillHandler();
														}}
													>
														Can effectively <b>change direction & speed</b>{' '}
														without losing control of the ball
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Running with the Ball'] ===
																100 && classes.lv1
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_6: 100 }));
															playerSkillHandler();
														}}
													>
														Can successfully &ldquo;<b>attack the space</b>
														&rdquo; to complete next action (shot, cross, pass
														etc)
													</TableCell>
												</TableRow>

												<TableRow>
													<TableCell
														align='center'
														className={classes.tableBorder}
													>
														<b>Proactive Defending</b>
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Proactive Defending'] === 20 &&
															classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_7: 20 }));
															playerSkillHandler();
														}}
													>
														Provides teammates <b>cover</b> when defending
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Proactive Defending'] === 40 &&
															classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_7: 40 }));
															playerSkillHandler();
														}}
													>
														<b>Positions</b> self well to effectively defend as
														part of a group (distances)
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Proactive Defending'] === 60 &&
															classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_7: 60 }));
															playerSkillHandler();
														}}
													>
														<b>Communicates</b> with teammates
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Proactive Defending'] === 80 &&
															classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_7: 80 }));
															playerSkillHandler();
														}}
													>
														Exhibits <b>understanding & anticipation</b> to
														regain the ball
													</TableCell>
													<TableCell
														align='center'
														className={`${classes.tableBorder} ${
															playerSkillRating['Proactive Defending'] ===
																100 && classes.lv4
														}`}
														onClick={() => {
															setSkill((prev) => ({ ...prev, score_7: 100 }));
															playerSkillHandler();
														}}
													>
														&ldquo;<b>Win the race</b>&rdquo; to the ball and
														space
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								</Box>
							</Stack>
						</Stack>
					</Box>
				</Stack>
			)}
		</>
	);
};

export default PlayerDetail;
