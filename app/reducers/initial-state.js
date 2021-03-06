import constants from '../constants/constants';
import _ from 'lodash';
const {
	NUM_CELLS
} = constants;

const cars = 
	_(_.sample(_.range(-50,NUM_CELLS-10), 170))
	.map((x) => {
		return {
			id: _.uniqueId(),
			x: x,
			x0: x
		};
	})
	.sortBy('x')
	.value();

const initialState = {
	time: 1,
	time_range: [0, 100],
	cars,
	paused: true
};

export default initialState;
