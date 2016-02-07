import constants from '../constants/constants';
import _ from 'lodash';
const {
	NUM_CELLS
} = constants;
const cells = _.map(_.range(NUM_CELLS), (d) => {
	return {
		x: d,
		k: Math.random()
	};
});

const cars = 
	_(_.sample(_.range(NUM_CELLS), 150))
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
	cells,
	time_range: [0, 100],
	cars
};

export default initialState;
