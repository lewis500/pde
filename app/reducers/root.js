import d3 from 'd3';
import _ from 'lodash';
import initialState from './initial-state';

const q = (k) => {
	return Math.min(0.5 - 0.5 * k, k);
};

const reduceCell = (cell, i, l) => {
	if (_.contains([l.length - 1, 0], i)) return cell;
	const k0 = cell.k,
		last = l[i - 1],
		next = l[i + 1],
		inflow = Math.min(last.k, q(k0), 1 - k0),
		outflow = Math.min(k0, q(next.k), 1 - next.k);
	return {
		...cell,
		k: outflow - inflow
	};
};

const reduceHistory = (state) => {
	let last = state.cells,
		history = _.map(_.range(100), () => {
			return last = _.map(last, reduceCell);
		});
	return {
		...state,
		history
	};
};

const reduceTime = (state, action) => ({
	...state,
	cells: state.history[action.time],
	time: action.time
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
