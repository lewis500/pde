import constants from '../constants/constants';
import _ from 'lodash';
const {NUM_CELLS} = constants;
const cells = _.map(_.range(NUM_CELLS), (d) => {
	return {
		x: d,
		k: Math.random()
	};
});

const initialState = {
	time: 1,
	cells,
	time_range: [0, 100],
};

export default initialState;