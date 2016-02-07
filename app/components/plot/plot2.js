import React from 'react';
import './style-plot.scss';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
	connect
}
from 'react-redux';
import constants from '../../constants/constants';
import _ from 'lodash';
import Canvas from '../canvas/canvas';

const {
	NUM_CELLS
} = constants;

const Street = React.createClass({
	render() {
		let {
			time, xScale, yScale, cells, ctx, w, h
		} = this.props,
			y = yScale(time);
		_.forEach(cells, (d) => {
			let x = xScale(d.x);
			ctx.fillStyle = d.fill;
			ctx.fillRect(x, y, w, h);
		});
		return null;
	}
});

const StreetFactory = React.createFactory(Street);

const PlotComponent = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			width: 700,
			height: 300,
		};
	},
	mar: {
		left: 30,
		top: 30,
		right: 5,
		bottom: 50
	},
	componentDidMount(){
		let xAxis = d3.svg.axis()
			.scale(d3.scale.linear().domain([0,100]).range([0,this.state.width]))
			.tickSize(-this.state.height);
		d3.select(this.refs.xAxis)
			.call(xAxis);
		let yAxis = d3.svg.axis()
			.scale(d3.scale.linear().domain([0,NUM_CELLS]).range([this.state.height,0]))
			.tickSize(-this.state.width)
			.orient('left');
		d3.select(this.refs.yAxis)
			.call(yAxis);
	},
	_yScale(v) {
		return this.state.height *(1 - (v - this.props.time_range[0]) / (this.props.time_range[1] - this.props.time_range[0]));
	},
	_xScale(v) {
		return this.state.width * v / NUM_CELLS; //LATER CHANGE THIS TO NUM_CELLS;
	},
	_renderCanvas() {
		let style = {
			top: this.mar.top,
			left: this.mar.left,
			// opacity: 
		};
		return (
			<Canvas
				width={this.state.width}
				height={this.state.height}
				style={style}>
				{
				_(this.props.history)
					.filter((d, i) => i <= this.props.time)
					.map((d, i) => {
						return StreetFactory({
							cells: d,
							yScale: this._yScale,
							xScale: this._xScale,
							time: i,
							key: i,
							w: this.state.width/NUM_CELLS*.98,
							h: this.state.height/100*.96
						});
					}).value()
			}
			</Canvas>
		);
	},
	render() {
		let {
			width, height
		} = this.state,
			{
				left, right, top, bottom
			} = this.mar,
			total_height = height + top + bottom,
			total_width = width + left + right,
			style = {
				width: total_width,
				height: total_height
			};
		return (
			<div 
				id='plot'
				style={style}>
				<svg 
					width={total_width} 
					height={total_height}>
					<g 
						transform={`translate(${left},${top})`}>
						<rect 
							width={width} 
							height={height} 
							className='background' />
						<g 
							ref='xAxis' 
							className='x axis'
							transform={`translate(0,${height})`}>
						</g>
						<g 
							ref='yAxis' 
							className='y axis'>
						</g>
					</g>
				</svg>
				{this._renderCanvas()}
			</div>
		);
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
