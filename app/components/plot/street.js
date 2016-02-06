import React from 'react';
import './style-street.scss';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';

const Cells = React.createClass({
	mixins: [PureRenderMixin],
	_renderRect(d) {
		return (
			<rect 
				className='cell'
				transform={`translate(0,${this.props.yScale(d.x)})`}
				fill={this.props.colorScale(d.k)}
				key={d.x}
			/>
		);
	},
	render() {
		let {
			cells, colorScale, yScale
		} = this.props;
		return (
			<g>
				{_.map(cells, this._renderRect)}
    	</g>
		);
	}
});

const Street = React.createClass({
	mixins: [PureRenderMixin],
	_colorScale: d3.scale.linear()
		.domain([0, 1])
		.interpolate(d3.interpolateHcl)
		.range(['#29B6F6', '#01579B']),
	render() {
		let {
			time, xScale, yScale, display, cells
		} = this.props;
		return (
			<g 
				className="g-street"	
				transform={`translate(${xScale(time)},0)`}
				style={{visibility: display ? 'visible' : 'hidden'}} 
			>
				<Cells 
					colorScale={this._colorScale} 
					yScale={yScale} 
					cells={cells} 
				/>
			</g>
		);
	}
})

export default Street;
