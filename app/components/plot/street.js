import React from 'react';
import './style-street.scss';
const {
	g, rect
} = React.DOM;

const Cell = (x,fill,key) => {
	return rect({
		className: 'cell',
		transform: `translate(${x},0)`,
		height: 8,
		width: 8,
		fill,
		key
	});
};

const Street = ({
	height, width, time, cells, xScale, yScale, colorScale
}) => {
	let cell_rects = _.map(cells, (d) => {
			return Cell(yScale(d.x),colorScale(d.k),d.x);
		}),
		background = rect({
			className: 'background',
			height: height,
			width: width
		}),
		gCells = g({
			transform: "rotate(90)",
			className: "g-cells"
		}, cell_rects);

	return g({
		className: "g-street",
		transform: `translate(${xScale(time)},0)`
	}, background, gCells);
};

export default Street;
