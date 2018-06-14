'use strict';
var React = require('react');
var Header = require('../components/header.jsx');
var ProfileLocation = require('../components/profileLocation.jsx');
var LocationAutocomplete = require('../components/locationAutocomplete.jsx');
var getProfileUrl = require('../helpers/urls').getProfileUrl;


class GetStarted extends React.Component {

  renderHiddenUserFields() {

    if (!this.props.user) return;

    var coords = this.props.user.coords && (
                  <input type="hidden" name="coords"
                         value={this.props.user.coords.lat + ',' + this.props.user.coords.long} />
                 );

    return (
      <div>
        <input type="hidden" name="tz" value={this.props.user.tz} />
        {coords}
      </div>
    )
  }

  render() {

    return (
      <div className="container login-container">

        <Header {...this.props} />

        <h1 className="page-headline">Get started</h1>

        <form action={getProfileUrl(this.props.user)} method="post" className="login-form">

          <input type="hidden" name="_csrf" value={this.props.csrf_token} />

          <p className="txt-center">
            First, enter your name
          </p>

          <div>
            <input type="text"
                   name="name"
                   placeholder="your name"
                   defaultValue={this.props.user.name} />
          </div>

          { this.props.locationField ? (
            <div>
              <p className="txt-center">
                Now, type below to search for your location
              </p>
              <LocationAutocomplete location={this.props.user.location}
                                    handleChange={this.props.handleLocationChange} />
              <span className="edit-person--timezone-display">
                {this.props.user.tz}
              </span>
            </div>
          ) : (
            <div className="form-row txt-center">
              <ProfileLocation location={this.props.user.location || 'Looking up your location...'}
                               tz={this.props.user.tz}
                               time={this.props.time}
                               timeFormat={this.props.timeFormat}
                               loading={this.props.checkingLocation} />
              <input type="hidden" name="location" value={this.props.user.location} />
            </div>
          ) }

          {this.renderHiddenUserFields()}

          <div>
            <button type="submit" className="cta login-button">
              This is great, take me to my profile
            </button>
          </div>

        </form>


      </div>
    );
  }
};

module.exports = GetStarted;

// TODO
// <p>
//   First, choose a username, this will be for your personal url
//   <span className="muted"> - ex. timezone.io/people/bodhi</span>
// </p>
//
// <div>
//   <input type="text"
//          name="username"
//          placeholder="username"
//          defaultValue={this.props.user.username} />
// </div>
