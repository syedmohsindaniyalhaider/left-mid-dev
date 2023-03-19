import React from 'react';
import { useSelector } from 'react-redux';
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from 'chart.js';

import { Radar } from 'react-chartjs-2';
import { toCappitalize } from 'utils/helper';
import Loading from 'components/Loadable/Loading';
import { Box } from '@mui/material';
ChartJS.register(
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend
);

const RadarChart = ({ playerSkillRating }) => {
	const { isLoadingSkill, skill } = useSelector(({ player }) => ({
		isLoadingSkill: player.isLoadingSkill,
		skill: player.skill,
	}));

	const newSkills = [
		{ skill: 'Skill_1', score: playerSkillRating['Striking the Ball'] },
		{ skill: 'Skill_2', score: playerSkillRating['Receiving (Awareness)'] },
		{ skill: 'Skill_3', score: playerSkillRating['Keep the ball (Evasion)'] },
		{ skill: 'Skill_4', score: playerSkillRating['1v1 Defending'] },
		{ skill: 'Skill_5', score: playerSkillRating['1v1 Attacking'] },
		{ skill: 'Skill_6', score: playerSkillRating['Running with the Ball'] },
		{ skill: 'Skill_7', score: playerSkillRating['Proactive Defending'] },
	];
	const options = {
		scale: {
			ticks: {
				stepSize: 20,
			},
			r: {
				max: 100,
				min: 0,
			},
		},
	};
	const data = {
		labels: newSkills?.map((item) => toCappitalize(item?.skill)),
		datasets: [
			{
				label: 'Skill score',
				data: newSkills?.map((item) => item.score),
				backgroundColor: 'rgb(255,113,41,0.2)',
				borderColor: 'rgb(255,113,41, 0.5)',
				borderWidth: 1,
			},
		],
	};

	return (
		<Box
			sx={{
				width: '40%',
			}}
		>
			<Radar data={data} options={options} />
		</Box>
	);
};

export default RadarChart;
