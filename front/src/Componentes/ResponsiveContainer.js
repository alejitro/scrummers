import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DesktopContainer from './DesktopContainer';
var conf = require('../conf');

class ResponsiveContainer extends Component {
  render() {
    return (
      <div>
        <DesktopContainer {...this.props}>{this.props.children}</DesktopContainer>
      </div>
    );
  }
}

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

export default ResponsiveContainer;