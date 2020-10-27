import React, { Component } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
var conf = require('../../conf');

class CardStore extends Component {

   render() {
    return (
      <Card>
        <Image size='small' centered src={this.props.urlImagen!=='no-image' && this.props.urlImagen!==null ?`${conf.URLS3}/store-${this.props.id}/${this.props.urlImagen}`:`${conf.URLS3}/images/default.jpg`} />
        <Card.Content>
          <Card.Header>{this.props.nameStore}</Card.Header>
        </Card.Content>
        <Card.Content extra>
          <Button
            content='Ver Tienda'
            color='teal'
            as='a'
            onClick={() => {this.props.onClick(this.props.id);}}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default CardStore;