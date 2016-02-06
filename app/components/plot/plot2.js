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
			time, xScale, yScale, cells, ctx
		} = this.props,
			x = xScale(time),
			w = 6,
			h = 1;
		_.forEach(cells, (d) => {
			let y = yScale(d.x);
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
	_xScale(v) {
		return this.state.width * (v - this.props.time_range[0]) / (this.props.time_range[1] - this.props.time_range[0]);
	},
	_yScale(v) {
		return this.state.height * v / NUM_CELLS; //LATER CHANGE THIS TO NUM_CELLS;
	},
	_renderCanvas() {
		let style = {
			top: this.mar.top,
			left: this.mar.left
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
            key: i
          });
        }).value()
      }
			</Canvas>
		);
	},
	render() {
		let {
			width, height
		} = this.state;
		let total_height = this.state.height + this.mar.top + this.mar.bottom,
			total_width = this.state.width + this.mar.left + this.mar.right;
		let style = {
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
						transform={`translate(${this.mar.left},${this.mar.top})`}>
						<rect 
							width={this.state.width} 
							height={this.state.height} 
							className='background' />
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
