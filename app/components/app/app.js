import { connect } from 'react-redux';
import React from 'react';
import Plot from '../plot/plot.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';
const {input} = React.DOM;
import './style-app.scss';

const AppComponent = React.createClass({
  mixins: [PureRenderMixin],
  onSlide(e) {
    this.props.setTime(+e.target.value);
  },
  render() {
    return (
      <div className='flex-container main'>
				<div style={{display: 'flex'}}>
					<Plot />
				</div>
				<div style={{display: 'flex', width: '100%'}}>
			    <input type="range" 
						min="0" 
						max="100" 
						step='1' 
						onChange={this.onSlide} 
						value={this.props.time}/>
				</div>
			</div>
      );
  }
});

const mapStateToProps = (state) => ({
    time: state.time
});

const mapActionsToProps = (dispatch) => {
  return {
    setTime(time) {
      dispatch({
        type: 'SET_TIME',
        time
      });
    }
  };
};

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
