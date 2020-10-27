import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Image,
  Card,
  Segment,
  CardGroup,
  Icon
} from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Player from './Componentes/Player';
import ResponsiveContainer from './Componentes/ResponsiveContainer';
import Axios from 'axios';
import Store from './Componentes/Store/NewStore';
import CardStore from './Componentes/Store/CardStore';
import DetailStore from './Componentes/Store/DetailStore';
import HomepageHeading from './Componentes/HomepageHeading';
var conf = require('./conf');
//const mem = require('../../memcached');


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      admin: localStorage.getItem('usuario'),
      openStore: false,
      listStores: [],
      storeActual: '',
      urlStoreActual: '',
      listProducts: [],
      listCache: [],
      modalStore: false,
    };
  }

  componentDidMount() {
    if (this.state.admin) {
      this.getStores();
    }else{
      this.getAllStores();
    } 
    let url_store = window.location.pathname.match(/\/store\/url\/([^/\n]*)/);
    if (url_store !== null) {
      this.setState({ urlStoreActual: url_store[1] });
    }
  }

  setAdmin = (user) => {
    this.setState({ admin: user }, () => {
      this.getStores();
    });
  }

  onCloseStore = () => {
    this.setState({
      openStore: false
    });
    this.getStores();
  }

  handleStore = () => {
    this.setState({ modalStore: true });
  }

  handleCloseStore = () => this.setState({ modalStore: false })

  viewStore = (idStore) => {
    this.state.listStores.map(store => {
      if (store.id === idStore) {
        this.setState({
          urlStoreActual: store.url,
          storeActual: store.id,
          storeInfo: store
        });
      }
    });
  }

  getStores = () => {
    let token = localStorage.getItem('JWToken');
    //Axios.get(`${conf.baseURL}/store/get/admin/${localStorage.getItem('iduser')}`, { headers: { 'Authorization': `Bearer ${token}` }, })
    Axios.get(`${conf.baseURL}/store/get/admin/${localStorage.getItem('iduser')}`).then(res => {
        this.setState({ listStores: res.data});
    }).catch(err => console.log(err));
  }

  getAllStores = () => {
    Axios.get(`${conf.baseURL}/store/get/all/`)
      .then(res => {
        this.setState({ listCache: res.data });
      }).catch(err => console.log(err));
  }

  renderHome = () => {
    return (
      <ResponsiveContainer 
        setAdmin={this.setAdmin}
        showHome={true}
      >
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <Segment>
          <Header as='h3' style={{ fontSize: '2em' }}>
          Comercios disponibles
          </Header>
          <Container>
            <CardGroup>
              {this.state.listCache.map(card => {
                let imgscr=`${conf.URLS3}/store-${card.id}/${card.banner}`
                return (
                  <Card as='a' href={`${window.location.href}store/url/${card.url}`} key={card.id}>
                    <Card.Content>
                      <Image size='small' centered src={card.banner!=='no-image'? `${imgscr}`:`${conf.URLS3}/images/default.jpeg`} />
                      <Card.Header>{card.name}</Card.Header>
                      <Card.Description>Ver Store</Card.Description>
                    </Card.Content>
                  </Card>
                );
              })}
            </CardGroup>
          </Container>   
        </Segment>
      </ResponsiveContainer>
    );
  }

  render() {
    if (!this.state.admin) {
      let path = window.location.pathname;
      if (this.state.urlStoreActual) {
        //Render Comercios para usuarios finales
        return (
          <ResponsiveContainer setAdmin={this.setAdmin}
            openStore={this.state.openStore}
            onCloseStore={this.onCloseStore}
          >
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
            <Container>
              <DetailStore
                info={this.state.storeInfo}
                id={this.state.storeActual}
                url={this.state.urlStoreActual}
              />
            </Container>
          </ResponsiveContainer>
        );
      }
      else {
        return this.renderHome();
      }
    }
    else {
      console.log("Store Actual",this.state.storeActual)
      if (!this.state.storeActual) {
        return (
          <ResponsiveContainer setAdmin={this.setAdmin}
            openStore={this.state.openStore}
            onCloseStore={this.onCloseStore}
          >
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
            <br></br>
            <Container text textAlign='center' className="center-vertical">
              <Divider/>
                <Button
                  content='Nuevo Comercio'
                  icon='plus circle'
                  onClick={this.handleStore}
                  as='a' 
                />
              <Divider/>
              <Segment>
                  <Header>Tiendas disponibles</Header>
                  <br></br>
                  <Grid>
                      <CardGroup>
                        {this.state.listStores.map(card => {
                          return (
                            <CardStore
                              key={card.id}
                              id={card.id}
                              urlImagen={card.banner}
                              nameStore={card.name}
                              url={card.url}
                              onClick={this.viewStore}
                            >
                            </CardStore>
                          );
                        })}
                      </CardGroup>
                  </Grid>
                  <br></br> 
              </Segment>
              <Store
                open={this.state.modalStore}
                onClose={this.handleCloseStore}
              />
            </Container>
          </ResponsiveContainer>
        );
      }
      else {
        return (
          <ResponsiveContainer setAdmin={this.setAdmin}
            openStore={this.state.openStore}
            onCloseStore={this.onCloseStore}
          >
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
            <Container>
              <Button
                as='a'
                icon
                labelPosition='right'
                onClick={() => this.setState({ storeActual: '' })}
              >Atras
                <Icon name='left arrow' />
              </Button>
              <DetailStore
                admin={this.state.admin}
                info={this.state.storeInfo}
                id={this.state.storeActual}
                url={this.state.urlStoreActual}
              />
            </Container>
          </ResponsiveContainer>
        );
      }
    }
  }
}

export default App;
