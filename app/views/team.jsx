'use strict';

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var AppToolbar = require('../components/AppToolbar.jsx');
var TimezoneList = require('../components/timezoneList.jsx');
var ManageTeam = require('../components/manageTeam.jsx');
var UserMenu = require('../components/userMenu.jsx');


class Team extends React.Component {

  handleClickMask(e) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.CLOSE_VIEW
    });
  }

  getUserMenu() {
    if (!this.props.user) return '';
    return <UserMenu {...this.props.user}
                     fixed={true} />;
  }

  render() {

    if (this.props.currentView === 'manage')
      return <ManageTeam {...this.props} />;

    return (
      <div className="container app-container app-with-toolbar">
        <AppToolbar {...this.props} />
        <TimezoneList {...this.props}
                      showStats={true} />
      </div>
    );
  }
}

module.exports = Team;
