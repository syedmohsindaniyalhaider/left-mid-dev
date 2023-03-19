import { createAsyncThunk } from '@reduxjs/toolkit';

import {
	getNotev2,
	updatePsychology,
	editReflection,
	deleteReflection,
	addReflection,
	getSelfImprove,
	getPlayerAssessmentInfo,
	getCoachFeedback,
	getPlayerSkill,
	updatePlayerSkillsRating,
} from './request';
import { showNoti, toCappitalize } from 'utils/helper';

const getPlayerSelfImprove = createAsyncThunk(
	'player/get-self-improve',
	async (data) => {
		try {
			const playerSelfImprove = await getSelfImprove(data.playerAssessmentId);
			return {
				status: true,
				data: playerSelfImprove,
			};
		} catch (err) {
			showNoti('error', err.message);
		}
	}
);

const getPlayerReflection = createAsyncThunk(
	'player/get-reflection',
	async (data) => {
		try {
			const reflection = await getPlayerAssessmentInfo(
				data.assessmentId,
				data.playerAssessmentId
			);
			return {
				status: true,
				data: reflection,
			};
		} catch (err) {
			showNoti('error', err.message);
		}
	}
);

const getPlayerAssessment = createAsyncThunk(
	'player/get-all',
	async (data, { rejectWithValue }) => {
		try {
			const trainingNote = [];
			const playerSelfImprove = await getSelfImprove(data.playerAssessmentId);
			const reflection = await getPlayerAssessmentInfo(
				data.assessmentId,
				data.playerAssessmentId
			);
			const feedback = await getCoachFeedback(data.playerAssessmentId);
			for (const event of data.eventId) {
				const res = await getNotev2(data.playerId, event);
				trainingNote.push(...res);
			}
			return {
				status: true,
				data: {
					trainingNote,
					playerSelfImprove,
					reflection,
					feedback,
				},
			};
		} catch (err) {
			showNoti('error', err.message);
			return rejectWithValue(err.response.data);
		}
	}
);

const updatePlayerPsychology = createAsyncThunk(
	'player/update-psychology',
	async (data) => {
		try {
			await updatePsychology(
				data.assessmentId,
				data.playerAssessmentId,
				data.label,
				data.value
			);
			return {
				status: true,
				key: data.label,
				value: data.value,
			};
		} catch (err) {
			showNoti('error', err.message);
		}
	}
);

const addCoachReflection = createAsyncThunk(
	'player/add-reflection',
	async (data) => {
		try {
			await addReflection(
				data.assessmentId,
				data.playerAssessmentId,
				data.content,
				data.coachId,
				data.coachName
			);
			showNoti('success', 'Add success');
			return {
				status: true,
				data: {
					coachId: data.coachId,
					coachName: data.coachName,
					content: data.content,
					createdAt: Math.round(Date.now() / 1000),
				},
			};
		} catch (err) {
			showNoti('error', err.message);
		}
	}
);

const editCoachReflection = createAsyncThunk(
	'player/edit-reflection',
	async (data) => {
		try {
			await editReflection(
				data.assessmentId,
				data.playerAssessmentId,
				data.content,
				data.coachId,
				data.coachName
			);
			showNoti('success', 'Edit success');
			return {
				status: true,
				data: {
					coachId: data.coachId,
					coachName: data.coachName,
					content: data.content,
					createdAt: Math.round(Date.now() / 1000),
				},
			};
		} catch (err) {
			showNoti('error', err.message);
		}
	}
);

const deleteCoachReflection = createAsyncThunk(
	'player/delete-reflection',
	async (data) => {
		try {
			// eslint-disable-next-line max-len
			await deleteReflection(data.assessmentId, data.playerAssessmentId);
			showNoti('success', 'Delete Success');
			return {
				status: true,
			};
		} catch (err) {
			showNoti('error', err.message);
		}
	}
);

const getPlayerSkillStat = createAsyncThunk(
	'player-get-skills',
	async (data) => {
		try {
			const skillList = [];
			const res = await getPlayerSkill(data.teamId, data.playerId);
			for (const skill in res?.skills) {
				let mainSkill = [];
				for (const subskill in res.skills[skill]) {
					mainSkill.push(res.skills[skill][subskill]);
				}
				skillList.push({
					skill,
					score: mainSkill.reduce((a, b) => a + b, 0) / mainSkill.length,
				});
				mainSkill = [];
			}
			return {
				status: true,
				data: skillList
					.filter(
						(item) => item.skill !== 'skillKeys' && item.skill !== 'isDynamic'
					)
					?.sort((a, b) => {
						if (a?.skill < b?.skill) {
							return -1;
						}
						if (a?.skill > b?.skill) {
							return 1;
						}
						return 0;
					})
					?.map((item) => {
						return {
							...item,
							skill: toCappitalize(item?.skill),
						};
					}),
			};
		} catch (err) {
			showNoti('error', err.message);
		}
	}
);

const updatePlayerSkills = createAsyncThunk(
	'update-player-skills',
	async (data) => {
		try {
			const rating = {
				[data.skill.skill_1]: data.skill.score_1,
				[data.skill.skill_2]: data.skill.score_2,
				[data.skill.skill_3]: data.skill.score_3,
				[data.skill.skill_4]: data.skill.score_4,
				[data.skill.skill_5]: data.skill.score_5,
				[data.skill.skill_6]: data.skill.score_6,
				[data.skill.skill_7]: data.skill.score_7,
			};
			await updatePlayerSkillsRating(
				rating,
				data?.assessmentId,
				data?.playerAssessmentId
			);
		} catch (err) {
			showNoti('error', err.message);
		}
	}
);

export {
	addCoachReflection,
	deleteCoachReflection,
	editCoachReflection,
	getPlayerAssessment,
	getPlayerReflection,
	getPlayerSelfImprove,
	getPlayerSkillStat,
	updatePlayerPsychology,
	updatePlayerSkills,
};
