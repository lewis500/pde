import React from 'react';
import './style-plot.scss';
import Street from './street';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
	connect
}
from 'react-redux';
import constants from '../../constants/constants';
import _ from 'lodash';
import Canvas from '../canvas/canvas';

const RectCanvas = React.createClass({
	render() {
		let {ctx,x,y,w,h,fill} = this.props;
		ctx.clearRect(x, y, w, h);
		ctx.fillStyle= fill;
		ctx.fillRect(x, y, w, h);
		return false;
	}
});

const StreetFactory = React.createFactory(Street);
const {
	NUM_CELLS
} = constants;

const PlotView = ({
	xScale, yScale, width, height, mar, time, history
}) => {
	let streets = _.map(history, (d, i) => {
		return StreetFactory({
			yScale,
			xScale,
			time: i,
				cells: d,
				key: "street" + i,
				display: i <= time
		});
	});
	return (
		<div>
			<svg 
				width={width + mar.left + mar.right} 
				height={height + mar.top + mar.bottom} >
				<g 
					className="g-main" 
					transform={`translate(${mar.left},${mar.top})`}>
					<rect 
						className="background" 
						width={width} 
						height={height}/>
					{streets}
				</g>
			</svg>

			<Canvas 
				width={width} 
				height={height}>
				<RectCanvas 
					w={5} 
					h={5} 
					x={5+time} 
					y={5+time} 
					fill={"#aaa"}
				/>
			</Canvas>
			
		</div>
	);
};
// <canvas width={width} height={height} ></canvas>

const PlotComponent = React.createClass({
	mixins: [PureRenderMixin],

	getInitialState() {
		return {
			width: 700,
			height: 300,
		};
	},
	_mar: {
		left: 30,
		top: 30,
		right: 5,
		bottom: 50

	},
	_xScale(v) {
		return this.state.width * (v - this.props.time_range[0]) / (this.props.time_range[1] - this.props.time_range[0]);
	},
	_yScale(v) {
		return this.state.height * v / NUM_CELLS; //LATER CHANGE THIS TO NUM_CELLS;
	},
	render() {
		return PlotView({
			xScale: this._xScale,
			yScale: this._yScale,
			mar: this._mar,
			width: this.state.width,
			height: this.state.height,
			time: this.props.time,
			history: this.props.history
		});
	}
});

const mapStateToProps = ({
	cells, time_range, time, history
}) => ({
	cells,
	history,
	time_range,
	time
});

const Plot = connect(mapStateToProps)(PlotComponent);

export default Plot;
