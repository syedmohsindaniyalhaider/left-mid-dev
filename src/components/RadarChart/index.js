/* eslint-disable */
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

const RadarChart = () => {
	const { isLoadingSkill, skill } = useSelector(({ player }) => ({
		isLoadingSkill: player.isLoadingSkill,
		skill: player.skill,
	}));
	const options = {
		scale: {
			ticks: {
				stepSize: 20,
			},
			r: {
				max: 80,
				min: 0,
			},
		},
	};
	const data = {
		labels: skill?.map((item) => toCappitalize(item?.skill)),
		datasets: [
			{
				label: 'Skill score',
				data: skill?.map((item) => item.score),
				backgroundColor: 'rgb(255,113,41,0.2)',
				borderColor: 'rgb(255,113,41, 0.5)',
				borderWidth: 1,
			},
		],
	};

	console.log('item==>', skill);

	return (
		<>
			{isLoadingSkill ? (
				<Loading />
			) : skill?.length != 0 ? (
				<Box
					sx={{
						width: '40%',
					}}
				>
					<Radar data={data} options={options} />
				</Box>
			) : (
				<></>
			)}
		</>
	);
};

export default RadarChart;
