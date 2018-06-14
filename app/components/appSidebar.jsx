/** @jsx React.DOM */

var React = require('react');
var time = require('../utils/time.js');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var TimeSlider = require('./timeSlider.jsx');

module.exports = React.createClass({
  handleFormatChange: function(e) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.CHANGE_TIME_FORMAT,
      value: +e.target.dataset.value
    });
  },
  handleGotoCurrentTime: function(e) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.USE_CURRENT_TIME
    });
  },
  render: function() {
    
    var format = this.props.timeFormat;
    var formatString = time.getFormatStringFor(this.props.timeFormat);
    var displayTime = this.props.time.format(formatString);

    return <div className="app-sidebar">
      
      <h2 className="app-sidebar--time">{displayTime}</h2>

      <TimeSlider time={this.props.time} 
                  isCurrentTime={this.props.isCurrentTime} />

      <div className="app-sidebar--button-row">
        
        <div className="button-group app-sidebar--format-select">
          <button className={'small hollow ' + (format === 12 ? 'selected' : '')}
                  data-value="12"
                  onClick={this.handleFormatChange}>12</button>
          <button className={'small hollow ' + (format === 24 ? 'selected' : '')}
                  data-value="24"
                  onClick={this.handleFormatChange}>24</button>
        </div>

        <button className="small hollow"
                disabled={this.props.isCurrentTime}
                onClick={this.handleGotoCurrentTime}>Now</button>
      </div>

    </div>;
  }
});