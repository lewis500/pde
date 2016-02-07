import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';

const q = (k) => {
	return Math.min(0.5 - 0.5 * k, k);
};

const colorScale = d3.scale.linear()
	.domain([0, 1])
	.interpolate(d3.interpolateHcl)
	.range(['#29B6F6', '#01579B']);

// const reduceCell = (cell, i, l) => {
// 	if (_.contains([l.length - 1, 0], i)) return cell;
// 	const k0 = cell.k,
// 		last = l[i - 1],
// 		next = l[i + 1],
// 		inflow = Math.min(last.k, q(k0), 1 - k0),
// 		outflow = Math.min(k0, q(next.k), 1 - next.k);
// 	return {
// 		...cell,
// 		k: outflow - inflow,
// 		fill: 'red'
// 			// fill: colorScale(outflow - inflow)
// 	};
// };

const VF = 1,
	SPACE = 1;

const reduceCars = (cars, dt) => {
	return _.map(cars, (car, i) => {
		if (i == (cars.length - 1)) {
			return {
				...car,
				x0: car.x,
					x: car.x0 + VF,
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
	});
};

const averageCars = (cells,cars) => {
	cells = cells.map(d=>({...d,k:0}));
	_.forEach(cars, (car) => {
		_.forEach(_.range(-2,2), (i)=>{
			let cell = cells[car.x+i];
			if(cell) cell.k = cell.k + 1/5;
		});
	});
	cells = cells.map(d=>({...d, fill: colorScale(d.k)}));
	return cells;
};

const reduceHistory = (state) => {
	let lastCells = state.cells,
		lastCars = state.cars;
	let history = _.map(_.range(300), () => {
		return {
			cars: lastCars = reduceCars(lastCars),
			cells: lastCells = averageCars(lastCells,lastCars)
		};
	});
	return {
		...state,
		history
	};
};

const reduceTime = (state, action) => ({
	...state,
	cells: state.history[action.time],
		time: action.time,
		cars: reduceCars(state.cars)
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
