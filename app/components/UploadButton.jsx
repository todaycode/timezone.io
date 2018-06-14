'use strict';
var React = require('react');
var s3 = require('../helpers/s3');


class UploadButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isUploading: false
    };
  }

  handleFileChange(e) {
    var files = e.target.files;
    var file = files[0];
    var ext = getFileExtension(file);

    if (['.jpg', '.jpeg', '.png'].indexOf(ext) === -1) {
      alert('Sorry, we currently only support jpg and png files :)');
      return;
    }

    if (!file) {
      return console.warn('No file added');
    }

    this.setState({ isUploading: true });

    // TODO - https://www.npmjs.com/package/crop-rotate-resize-in-browser
    s3.uploadFile(file, generateAvatarUploadFilename(this.props.fileName, file))
      .then(function(fileUrl) {

        this.setState({ isUploading: false });

        // Lambda function will resize image and rename it
        var resizedUrl = fileUrl.replace('_full', '');

        // Reset input file for users that need to re-upload the same file
        this.refs.avatarFileinput.getDOMNode().value = '';

        return {
          full: fileUrl,
          resized: resizedUrl
        };
      }.bind(this))
      .then(this.props.handleUploaded);
  }

  render() {
    return (
      <div className="button button-upload"
           title="Images are preferably square and under 500kb">
        <input type="file"
               name="avatar_file"
               ref="avatarFileinput"
               onChange={this.handleFileChange.bind(this)} />
        { this.state.isUploading ? 'Uploading...' : 'Upload a photo' }
      </div>
    );
  }
}

UploadButton.propTypes = {
  fileName: React.PropTypes.string.isRequired,
  handleUploaded: React.PropTypes.func.isRequired
};

var getFileExtension = function(file) {
  var matches = /\.\w+$/.exec(file.name);
  return matches && matches[0];
};

var generateAvatarUploadFilename = function(fileName, file) {
  // Files ending in _full will trigger the resize lambda function
  return 'avatar/' + fileName + '_full' + getFileExtension(file);
};

module.exports = UploadButton;
