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
    dispatch(
      updatePlayerSkills({
        skill: skill,
        assessmentId: assessmentId,
        playerAssessmentId: data.id,
      })
    );
  }, [dispatch, assessmentId, data.id, skill]);

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
              <RadarChart />
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
                            onClick={() =>
                              setSkill((prev) => ({
                                ...prev,
                                score_1: 20,
                              }))
                            }
                          >
                            <b>Striking the Ball</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv1}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_1: 20 }))
                            }
                          >
														Passes the ball under 5m &ldquo;<b>cleanly</b>
														&rdquo; (firm, flat, accurate)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv2}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_1: 40 }))
                            }
                          >
														Passes the ball to 10m &ldquo;<b>cleanly</b>&rdquo;
														(firm, flat, accurate)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv3}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_1: 60 }))
                            }
                          >
														Strikes the ball with <b>weaker foot</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv4}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_1: 80 }))
                            }
                          >
														Can accurately strike the ball in <b>the air</b>{' '}
														(&gt;15m)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv5}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_1: 100 }))
                            }
                          >
														Can strike the ball with <b>different</b> surfaces,
														spins and with disguise
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            align='center'
                            className={classes.tableBorder}
                            onClick={() =>
                              setSkill((prev) => ({
                                ...prev,
                                score_2: 20,
                              }))
                            }
                          >
                            <b>Receiving</b> <br /> <b>(Awareness)</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv1}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_2: 20 }))
                            }
                          >
                            <b>Moves</b> to effective spaces before receiving
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv2}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_2: 40 }))
                            }
                          >
														Show a good <b>awareness</b> of surroundings (scans)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv3}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_2: 60 }))
                            }
                          >
														Receives with an open <b>body shape</b> (can see 3/4
														of the field)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv4}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_2: 80 }))
                            }
                          >
                            <b>Communicates</b> before receiving (verbal /
														non-verbal)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv5}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_2: 100 }))
                            }
                          >
														Takes <b>1st touch</b> into good spaces / away from
														a defender
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            align='center'
                            className={classes.tableBorder}
                            onClick={() =>
                              setSkill((prev) => ({
                                ...prev,
                                score_3: 20,
                              }))
                            }
                          >
                            <b>Keep the ball</b> <br /> <b>(Evasion)</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv1}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_3: 20 }))
                            }
                          >
														Displays good <b>close control</b> of the ball
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv2}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_3: 40 }))
                            }
                          >
														Uses <b>both feet and fiffrent surfaces</b> to live
														on the ball
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv3}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_3: 60 }))
                            }
                          >
														Changes <b>directions & speed</b> to evade defender
														(feints, disguise)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv4}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_3: 80 }))
                            }
                          >
														Uses <b>body</b> to protect the ball from the
														defender
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv5}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_3: 100 }))
                            }
                          >
														Can successfully <b>escape</b> a defender to then
														make next action (pass, shot, dribble etc)
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            align='center'
                            className={classes.tableBorder}
                            onClick={() =>
                              setSkill((prev) => ({
                                ...prev,
                                score_4: 20,
                              }))
                            }
                          >
                            <b>1v1 Defending</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv1}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_4: 20 }))
                            }
                          >
														Applies effective <b>pressure</b> on the ball
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv2}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_4: 40 }))
                            }
                          >
														Uses body well to force/show a <b>direction</b> to
														the attacker
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv3}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_4: 60 }))
                            }
                          >
														Exhibits good <b>body shape</b> (side on, low,
														balanced)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv4}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_4: 80 }))
                            }
                          >
														Shows controlled <b>aggression and timing</b> when
														making a challenge at the ball
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv5}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_4: 100 }))
                            }
                          >
                            <b>&rdquo;Doesn&lsquo;t get beaten&ldquo;</b> easily
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            align='center'
                            className={classes.tableBorder}
                            onClick={() =>
                              setSkill((prev) => ({
                                ...prev,
                                score_5: 20,
                              }))
                            }
                          >
                            <b>1v1 Attacking</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv1}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_5: 20 }))
                            }
                          >
														Choses to <b>&ldquo;take the defender on&rdquo;</b>{' '}
														(decision)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv2}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_5: 40 }))
                            }
                          >
														Uses <b>both feet</b> when attacking the defender
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv3}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_5: 60 }))
                            }
                          >
														Changes <b>speed & direction</b> or uses feints to
														go past the defender
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv4}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_5: 80 }))
                            }
                          >
														Has a <b>signature move</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv5}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_5: 100 }))
                            }
                          >
														Can consistently <b>get past a defender</b> to
														complete next action (pass, shot, cross etc)
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            align='center'
                            className={classes.tableBorder}
                            onClick={() =>
                              setSkill((prev) => ({
                                ...prev,
                                score_6: 20,
                              }))
                            }
                          >
                            <b>Running with the Ball</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv1}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_6: 20 }))
                            }
                          >
														Keeps ball under <b>control</b> at all times
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv2}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_6: 40 }))
                            }
                          >
                            <b>Moves quickly</b> with the ball
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv3}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_6: 60 }))
                            }
                          >
														Can travel fast while using <b>both feed</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv4}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_6: 80 }))
                            }
                          >
														Can effectively <b>change direction & speed</b>{' '}
														without losing control of the ball
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv5}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_6: 100 }))
                            }
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
                            onClick={() =>
                              setSkill((prev) => ({
                                ...prev,
                                score_7: 20,
                              }))
                            }
                          >
                            <b>Proactive Defending</b>
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv1}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_7: 20 }))
                            }
                          >
														Provides teammates <b>cover</b> when defending
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv2}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_7: 40 }))
                            }
                          >
                            <b>Positions</b> self well to effectively defend as
														part of a group (distances)
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv3}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_7: 60 }))
                            }
                          >
                            <b>Communicates</b> with teammates
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv4}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_7: 80 }))
                            }
                          >
														Exhibits <b>understanding & anticipation</b> to
														regain the ball
                          </TableCell>
                          <TableCell
                            align='center'
                            className={`${classes.tableBorder} ${classes.lv5}`}
                            onClick={() =>
                              setSkill((prev) => ({ ...prev, score_7: 100 }))
                            }
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
