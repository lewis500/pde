import d3 from 'd3';
import _ from 'lodash';
import {
	NUM_CELLS
}
from '../constants/constants.js';
import initialState from './initial-state';

const q = (k) => {
	return Math.min(0.5 - 0.5 * k, k);
};

const reduceCell = (dt, cell, i, l) => {
	if(_.contains([l.length-1,0], i)) return cell;
	const k0 = cell.k,
		last = l[i-1],
		next = l[i+1],
		inflow = Math.min(last.k,q(k0),1 - k0),
		outflow = Math.min(k0,q(next.k),1 - next.k);
	return {
		...cell,
		k: outflow-inflow
	};
};

const reduceTime = (state, action) => {
	const dt = action.time - state.time,
		boundreduceCell = reduceCell.bind(null,dt),
		newCells = _.map(state.cells, boundreduceCell);
	return {
		...state,
		cells: newCells,
			time: action.time
	};
};

function rootReduce(state = initialState, action) {
	switch (action.type) {
		case 'SET_TIME':
			return reduceTime(state, action);
		default:
			return state;
	}
}

export default rootReduce;
