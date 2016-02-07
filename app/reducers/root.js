import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';
import col from '../style/colors';

const VF = 1,
	SPACE = 1;

const reduceCars = (cars, dt) => {
	return _.map(cars, (car, i) => {
			let next = cars[(i + 1)],
				x0 = car.x;
			if (!next) return {
				...car, x0, x: x0 + VF
			};
			let x = Math.round(Math.max(Math.min(x0 + VF, next.x0 - SPACE), x0));
			return {
				...car,
				x,
				x0
			};
		})
		.map((car, i, l) => {
			let next = l[i + 1],
				prev = l[i - 1];
			if (!next || !prev) return car;
			let gap1 = next.x - car.x,
				gap0 = car.x - prev.x,
				fill = colorScale(.5 / gap1 + .5 / gap0);
			return {
				...car,
				fill,
				gap1,
				gap0
			};
		});
};

const colorScale = d3.scale.linear()
	.domain([0, 1 / SPACE])
	.interpolate(d3.interpolateHcl)
	.range([col['red']['50'], col.pink['800']]);

const reduceHistory = (state) => {
	let lastCars = state.cars;
	let history = _.map(_.range(300), (i) => {
		return {
			cars: lastCars = reduceCars(lastCars),
			time: i
		};
	});
	return {
		...state,
		history
	};
};

const reduceTime = (state, time) => {
	let paused = time >= 100 ? true : state.paused;
	return {
		...state,
		paused,
		time,
		cars: state.history[time].cars
	};
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'CALC_HISTORY':
			return reduceHistory(state);
		case 'ADVANCE':
			return reduceTime(state, state.time + 1);
		case 'SET_TIME':
			return reduceTime(state, action.time);
		case 'PAUSE_PLAY':
			return {...state, paused: !state.paused
			};
		default:
			return state;
	}
};

export default rootReduce;
