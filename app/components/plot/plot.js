import React from 'react';
import './style-plot.scss';
import Street from './street';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

const PlotView = ({xScale, yScale, width, height, mar, cells, colorScale, time}) => {
	let street = Street({
		yScale,
		xScale,
		height,
		width,
		cells,
		colorScale,
		time
	});

	return (
		<svg width={width + mar.left + mar.right} height={height + mar.top + mar.bottom} >
			<g className="g-main" transform={`translate(${mar.left},${mar.top})`}>
				<rect className="background" width={width} height={height}/>
				{street}
			</g>
		</svg>
		);
};

const PlotComponent = React.createClass({
	mixins: [PureRenderMixin],
	componentDidMount(){
		window.addEventListener('resize', this._resize);
	},
	getInitialState() {
		return {
			width: 300,
			height: 300,
		};
	},
	_resize(){
		// let parent = ReactDOM.findDOMNode(this);
		// this.setState({
		// 	width: React.getDOMNode(this).
		// 	// width: window.clientWidthp*.3
		// });
		console.log('asdf');
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
		return this.state.height * v / 100; //LATER CHANGE THIS TO NUM_CELLS;
	},
	render() {
		return PlotView({
			xScale: this._xScale,
			yScale: this._yScale,
			width: this.state.width,
			height: this.state.height,
			cells: this.props.cells,
			colorScale: this.props.colorScale,
			mar: this._mar,
			time: this.props.time
		});
	}
});


const mapStateToProps = ({cells, time_range, colorScale, time}) => ({
		cells,
		time_range,
		colorScale,
		time
});

const Plot = connect(mapStateToProps)(PlotComponent);

export default Plot;
