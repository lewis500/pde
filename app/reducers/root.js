import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';
import col from '../style/colors';

const VF = 1,
	SPACE = 1;

const reduceCars = (cars, dt) => {
	return _.map(cars, (car, i) => {
			if (i == (cars.length - 1)) {
				return {
					...car,
					x0: car.x,
						x: car.x0 + VF,
						gap: 100,
						fill: colorScale(1 / 100)
				};
			}
			let next = cars[(i + 1)],
				x0 = car.x,
				x = Math.round(Math.max(Math.min(x0 + VF, next.x0 - SPACE), x0));
			return {
				...car,
				x,
				x0
			};
		})
		.map((car, i, l) => {
			let next = l[i + 1];
			if (!next) return car;
			let gap = next.x - car.x,
				fill = colorScale(1/gap);
			return {
				...car,
				fill,
				gap
			};
		});
};

const colorScale = d3.scale.linear()
	.domain([0, 1])
	.interpolate(d3.interpolateHcl)
	.range([col['red']['50'],col.pink['800']]);

const reduceHistory = (state) => {
	let lastCars = state.cars;
	let history = _.map(_.range(300), () => {
		return {
			cars: lastCars = reduceCars(lastCars),
		};
	});
	return {
		...state,
		history
	};
};

const reduceTime = (state, action) => ({
	...state,
	time: action.time,
		cars: state.history[action.time].cars
});

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'CALC_HISTORY':
			return reduceHistory(state);
		case 'SET_TIME':
			return reduceTime(state, action);
		default:
			return state;
	}
};

export default rootReduce;
