import React, { Component } from 'react';
import { Container, Button, CardGroup, Image, Accordion, Icon, Divider, Confirm, Input } from 'semantic-ui-react';
import Axios from 'axios';
import CardProduct from '../Product/CardProduct';
import NewProduct from '../Product/NewProduct';
import EditStore from './EditStore';
var conf = require('../../conf');

class DetailStore extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url_store: this.props.url,
      listProduct: [],
      deleteProduct: false,
      openCreateProduct: false,
      openEditStore: false,
      idStore: this.props.id,
      activeIndex: 0,
      info: {},
      openConfirm: false,
      activePage: 1,
      pagStart: 0,
      pagLimit: 50
    };
  }

  show = () => this.setState({ openConfirm: true })
  handleCancel = () => this.setState({ openConfirm: false })

  componentDidMount() {
    if (!this.props.info) {
      this.getInfoStore();
    }
    else {
      this.setState({ info: this.props.info });
    }
    if (this.props.admin) {
      this.getProduct();
    } else {
      this.getProductxUrl();
    }

  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  getInfoStore = () => {
    Axios.get(`${conf.baseURL}/store/get/url/${this.state.url_store}`)
      .then(res => {
        let datos = res.data[0];
        this.setState({ info: datos });
      }).catch(err => console.log(err));
  }

  updateUrlStore = (nuevaUrl) => {
    this.setState({ url_store: nuevaUrl });
  }

  getProduct = () => {
    //Axios.get(`${conf.baseURL}/product/get/store/${this.props.id}/${(this.state.activePage - 1) * 50}/50`)
    Axios.get(`${conf.baseURL}/product/get/store/${this.props.id}`)
      .then(res => {
        this.setState({ listProduct: res.data });
      }).catch(err => console.log(err));
  }

  getProductxUrl = () => {
    Axios.get(`${conf.baseURL}/product/get/store/url/${this.props.url}`)
      .then(res => {
        this.setState({ listProduct: res.data });
        this.setState({ idStore: res.data[0].idstore });
      }).catch(err => console.log(err));
  }

  onCloseCreateProduct = () => {
    this.setState({
      openCreateProduct: false
    });
  }

  onCloseEditStore = () => {
    this.setState({
      openEditStore: false
    });
  }

  createNewProduct = () => {
    this.setState({ openCreateProduct: true });
  }

  editStore = () => {
    console.log('url en detalle store: ', this.state.url_store);
    this.setState({ openEditStore: true });
  }

  deleteStore = () => {
    let token = localStorage.getItem('JWToken');
    let admin = localStorage.getItem('iduser');
    console.log('Store a delete props: ', this.props.id);
    Axios.delete(`${conf.baseURL}/store/delete/${this.props.id}/${admin}`, { headers: { 'Authorization': `Bearer ${token}` }, })
      .then(res => {
        console.log(res);
      }).catch(err => console.log(err));
    this.handleCancel();
    window.location = window.location.origin;
  }
  
  copyToClipboard = (e) => {
    this.textArea.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    console.log('copiado');
    this.setState({ copySuccess: 'Copied!' });
  }

  render() {
    const { activeIndex, activePage } = this.state;
    if (this.props.admin) {
      return (
        <Container>
          {/*console.log("**"+ JSON.stringify(this.state))*/}
          {/*console.log("**"+ JSON.stringify(this.props))*/}
          <h1>{this.state.info.name}</h1>
          {this.state.info.url ?
            <Input
              style={{ width: 500 }}
              ref={(textarea) => this.textArea = textarea}
              action={{ color: 'teal', labelPosition: 'right', icon: 'copy', content: 'Copy', onClick: this.copyToClipboard }}
              defaultValue={`${window.location.origin}/store/url/${this.state.info.url}`}
            />
            : <div></div>}
          <Divider />
          <Button onClick={this.editStore} >Editar Comercio  <Icon name='edit' /></Button>
          <Button onClick={this.show}>Borrar Comercio  <Icon name='delete' /></Button>
          <Button onClick={this.createNewProduct}> Crear producto <Icon name='plus' /></Button>
        <Divider/>
          <Image size='medium' centered src={this.state.info.banner != null && this.state.info.banner !== 'no-image' ? `${conf.URLS3}/store-${this.props.id}/${this.state.info.banner}` : `${conf.URLS3}/images/default.jpeg`}></Image>
          <Divider />
          <br></br>
          <h2>Productos</h2>
          <Divider />
          <CardGroup>
            {this.state.listProduct ?
              this.state.listProduct.map(card => {
                console.log("Product name: ", card.name);
                return (
                  <CardProduct
                    admin={this.props.admin}
                    key={card.id}
                    product_id={card.id}
                    name={card.name}
                    price={card.price}
                    salesprice={card.salesprice}
                    quantity={card.quantity}
                    idstore={card.store}
                    url={this.state.url_store}
                    file={`${conf.URLS3}/store-${card.store}/product-${card.name}/${card.multimedia}`}
                  />
                );
              }) : <div></div>
            }
          </CardGroup>
          <EditStore
            open={this.state.openEditStore}
            onClose={this.onCloseEditStore}
            urlStore={this.state.url_store}
            infoStore={this.state.info}
            updateUrl={this.updateUrlStore}
            refrescar={this.getInfoStore}
          />
          <Confirm
            open={this.state.openConfirm}
            content='Esta seguro de eliminar el store'
            onCancel={this.handleCancel}
            onConfirm={this.deleteStore}
          />
          <NewProduct
            open={this.state.openCreateProduct}
            onClose={this.onCloseCreateProduct}
            idStore={this.props.id}
            url={this.state.url_store}
            refresh={this.getProductxUrl}
          />
        </Container>
      );
    }
    else {
      return (

        <Container>
          <h1>{this.state.info.name}</h1>
          <Image size='medium' centered src={this.state.info.banner != null && this.state.info.banner !== 'no-image' ? `${conf.URLS3}/store-${this.state.info.id}/${this.state.info.banner}` : `${conf.URLS3}/images/default.jpeg`}></Image>
          <Divider/>
          {/*<Accordion fluid styled>
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Fechas
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <h3>Fecha Inicio: {this.state.info.fecha_inicio}</h3>
              <h3>Fecha Fin: {this.state.info.fecha_fin}</h3>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Guion
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <p>
                {this.state.info.guion}
              </p>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Recomendaciones
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>
              <p>
                {this.state.info.recomendaciones}
              </p>
            </Accordion.Content>
            <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
              <Icon name='dropdown' />
              Premio
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 3}>
              <h3>
                $ {this.state.info.valor}
              </h3>
            </Accordion.Content>
          </Accordion>*/}
          <br></br>
          <h2>Productos</h2>
          <h2>Productos</h2>
          <Divider />
          <CardGroup>
            {this.state.listProduct ?
              this.state.listProduct.map(card => {
                console.log("Product name: ", card.name);
                return (
                  <CardProduct
                    admin={this.props.admin}
                    key={card.id}
                    product_id={card.id}
                    name={card.name}
                    price={card.price}
                    salesprice={card.salesprice}
                    quantity={card.quantity}
                    idstore={card.store}
                    url={this.state.url_store}
                    file={`${conf.URLS3}/store-${card.store}/product-${card.name}/${card.multimedia}`}
                  />
                );
              }) : <div></div>
            }
          </CardGroup>
        </Container>
      );
    }
  }
}

export default DetailStore;