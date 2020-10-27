import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Container,
  Header,
  Icon
} from 'semantic-ui-react';

var conf = require('../conf');

const HomepageHeading = ({ mobile }) => (
  <Container
    fluid
    text>
    <Header
      as='h1'
      content='Scrummers Online Shop'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '2em',
      }}
    />
  </Container>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
};

export default HomepageHeading;