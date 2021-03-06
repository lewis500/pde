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

const Rects = React.createClass({
	mixins: [PureRenderMixin],
	componentWillUnmount() {
		let {
			time, xScale, yScale, cars, ctx, h
		} = this.props,
			y = yScale(time);
		this.props.ctx.clearRect(0, y-h, xScale(NUM_CELLS), 2*h);
	},
	componentWillMount() {
		let {
			time, xScale, yScale, cars, ctx, h
		} = this.props,
			y = yScale(time);
		_.forEach(cars, (d, i, l) => {
			if ((i === l.length) || (i == 0)) return;
			let x = xScale(d.x - d.gap0 / 2),
				w = xScale(d.x + d.gap1 / 2) - x;
			ctx.fillStyle = d.fill;
			ctx.fillRect(x, y, w, h);
		});
	},
	render() {
		return null;
	}
});

const RectsFactory = React.createFactory(Rects);

const PlotComponent = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			width: 1150,
			height: 480,
		};
	},
	mar: {
		left: 30,
		top: 30,
		right: 5,
		bottom: 30
	},
	componentDidMount() {
		let xAxis = d3.svg.axis()
			.scale(d3.scale.linear()
				.domain([0, NUM_CELLS])
				.range([0, this.state.width]))
			.tickSize(-this.state.height);
		d3.select(this.refs.xAxis)
			.call(xAxis);
		let yAxis = d3.svg.axis()
			.scale(d3.scale.linear()
				.domain([0, 100])
				.range([this.state.height, 0]))
			.tickSize(-this.state.width)
			.orient('left');
		d3.select(this.refs.yAxis)
			.call(yAxis);
	},
	_yScale(v) {
		return this.state.height * (1 - (v - this.props.time_range[0]) / (this.props.time_range[1] - this.props.time_range[0]));
	},
	_xScale(v) {
		return this.state.width * v / NUM_CELLS; //LATER CHANGE THIS TO NUM_CELLS;
	},
	_renderCanvas() {
		let style = {
			top: this.mar.top,
			left: this.mar.left,
		};
		return (
			<Canvas
				width={this.state.width}
				height={this.state.height}
				style={style}>
				{
				_(this.props.history)
					.filter((d, i) => d.time < this.props.time)
					.map((d,) => {
						return RectsFactory({
							cars: d.cars,
							yScale: this._yScale,
							xScale: this._xScale,
							time: d.time,
							key: d.time,
							h: this.state.height/100
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
				...this.props.style,
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

					<g transform={`translate(${left},${top})`}>
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
				<svg 
					width={total_width} 
					height={total_height}>
					<clipPath id="myClip" >
						<rect width={width} height={height+50} transform='translate(0,-50)'/>
					</clipPath>
					<g transform={`translate(${left},${top})`} clipPath='url(#myClip)'>
						<g 
							style={{transform: `translate(0px,${this._yScale(this.props.time)-4}px)`}}
							className='g-cars'>
							<rect 
								width={width} 
								height={35} 
								y={-25} 
								className='cars-bg' />
							{
								_.map(this.props.cars, (car)=>{
								return (
									<rect 
										className='car' 
										key={car.id}
										y={-13.5}
										height={12}
										width={2.6}
										x={this._xScale(car.x)-1.25}/>
									);
								})
							}
						</g>
					</g>
				</svg>
			</div>
		);
	}
});

const mapStateToProps = ({
	time_range, time, cars, history
}) => ({
	cars,
	history,
	time_range,
	time
});

const Plot = connect(mapStateToProps)(PlotComponent);

export default Plot;
