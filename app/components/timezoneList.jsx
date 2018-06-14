'use strict';

var React    = require('react');
var classNames = require('classnames');
var Timezone = require('./timezone');

const PEOPLE_PER_COL = 8;

var count = function(metric, people) {
  var items = people.reduce(function(list, p) {
    if (!p[metric])
      return list;
    if (list.indexOf(p[metric].toLowerCase()) === -1)
      list.push(p[metric].toLowerCase());
    return list;
  }, []);
  return items.length;
};

class TimezoneList extends React.Component {

  getStats(people) {

    // Note the homepage doesn't provide people, only timezones
    if (!people || !Array.isArray(people)) return;

    var numPeople = people.length;
    var numCities = count('location', people);
    var numTimezones = this.props.timezones.length;

    return `${numPeople} people in ${numCities} cities across ${numTimezones} timezones`;
  }

  getColumnNumber(timezones) {
    return timezones.reduce(function(cols, timezone) {
      return cols + Math.ceil(timezone.people.length / PEOPLE_PER_COL);
    }, 0);
  }

  render() {

    var timeFormat = this.props.timeFormat || 12;

    var stats = this.getStats(this.props.people);
    var numCols = this.getColumnNumber(this.props.timezones);
    var sizeClass = 'timezone-list-' + (numCols > 10 ? 'wide' : 'normal');

    var containerClasses = classNames('timezone-list', {
      'timezone-list-normal': numCols <= 10,
      'timezone-list-wide': numCols > 10,
      'timezone-list-active-filter': !!this.props.activeFilter
    });

    return (
      <div className={containerClasses}>
        <div className="timezone-wrapper">
          {this.props.timezones.map(function(timezone) {
            return (
              <Timezone
                key={timezone.tz}
                timezone={timezone}
                time={this.props.time}
                timeFormat={timeFormat}
                activeFilter={this.props.activeFilter}
              />
            );
          }.bind(this))}
        </div>
        { this.props.showStats &&
          <div className="team-stats"><em>{stats}</em></div>
        }
      </div>
    );
  }

}

module.exports = TimezoneList;
