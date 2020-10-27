import React, { Component } from 'react';
import { Card, Button,Input, Image, CardContent, Divider } from 'semantic-ui-react';
import Player from '../Player';
import Axios from 'axios';
var conf = require('../../conf');

class CardProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cant: 0,
      listAttr:[],
      store:''
    };
  }

  componentDidMount() {
    this.setState({store:this.props.store})
    this.getAttributes();
    console.log("File",this.props.file);
    //this.getMultimedia();
  }


  getAttributes=()=>{
    Axios.get(`${conf.baseURL}/inventory/get/store/${this.props.idstore}/${this.props.product_id}`)
      .then(res => {
        this.setState({listAttr:res.data});
      }).catch(err => console.log(err));
  }

  getMultimedia =()=>{
      let file=this.props.file.split('/');
      let largo=file.length;
      let name=file[largo-1];
      let namesplit=name.split('.');
      let ext=namesplit[namesplit.length-1];
      //console.log("ListAtributos: ", this.state.listAttr)
      if(name!=='null'){
        if(ext==='jpg'||ext==='jpeg' || ext==='bmp' || ext=='png'){
          return(
            <Image size='small' centered src={this.props.file.replace(/\s/g,'+')} />
          );
        }else{    
          return(
            <Card.Content extra>
              <Player
                idplayer={this.props.product_id}
                archivo={this.props.file}
              ></Player>
            </Card.Content>
          );
        }
      }else{
        return(<div></div>);
      }
  }

  buyProduct=()=>{
    let formData = new FormData();
    formData.append("idproduct",this.props.product_id);
    formData.append("idstore",this.props.idstore);
    let updateCant=this.props.quantity-this.state.cant;
    Axios.put(`${conf.baseURL}/product/update/inv/${updateCant}`,formData)
      .then(res => {
        console.log("Buy Product",res)
      }).catch(err => console.log(err));
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }
  render() {
    if(this.props.admin){
      console.log("ListAtributos: ", this.state.listAttr)
      return (
        <Card>
          <Card.Content>
            <Card.Header>{this.props.name}</Card.Header>
            {this.getMultimedia()}
            {this.state.listAttr.map((atr)=>{
                return(
                  <Card.Meta>
                    <strong> {atr.name}</strong><br/>
                  </Card.Meta>
                )
              })
            }
            <Card.Description>
              <strong> Precio: </strong> ${this.state.listAttr[0]? this.state.listAttr[0].price : 0} <br />
              <strong> Precio venta: </strong> ${this.state.listAttr[0]? this.state.listAttr[0].salesprice : 0} <br />
              <strong> Stock disponible: </strong> {this.state.listAttr[0]? this.state.listAttr[0].quantity : 0} <br />
            </Card.Description>
          </Card.Content>
        </Card>
      );
    }else{
      return(
        <Card >
          <Card.Content>
          <Card.Header>{this.props.name}</Card.Header>
            {this.getMultimedia()}
            {this.state.listAttr.map((atr)=>{
                return(
                  <Card.Meta>
                    <strong> {atr.name}</strong><br/>
                  </Card.Meta>
                )
              })
            }
            <Card.Description>
              <strong> Precio: </strong> ${this.state.listAttr[0]? this.state.listAttr[0].salesprice : 0} <br />
              <strong> Stock disponible: </strong> {this.state.listAttr[0]? this.state.listAttr[0].quantity : 0} <br />
            </Card.Description>
            <Divider/>
            <CardContent extra>
              <Input fluid='true'
                name='cant'
                size='mini'
                action={{
                  color: 'teal',
                  labelPosition: 'left',
                  icon: 'cart',
                  content: 'Comprar',
                  onClick:this.buyProduct
                }}
                actionPosition='left'
                defaultValue='1'
                onChange={this.handleChange}
              />
            </CardContent>
          </Card.Content>
        </Card>
        
      );
    }
  }
}

export default CardProduct;