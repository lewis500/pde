import constants from '../constants/constants';
import _ from 'lodash';
const {NUM_CELLS} = constants;
const cells = _.map(_.range(NUM_CELLS), (d) => {
	return {
		x: d,
		k: Math.random()
	};
});

const colorScale = d3.scale.linear()
	.domain([0, 1])
	.range(['red', 'blue']);

const initialState = {
	time: 0,
	cells,
	time_range: [0, 100],
	colorScale
};

export default initialState;