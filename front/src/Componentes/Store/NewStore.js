import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import { toast } from 'react-toastify';
import moment from 'moment';
var conf = require('../../conf');

class NewStore extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      url: '',
      banner: [],
      datoFecha:'',
    };


  }

  componentDidMount() {
    this.setState({ url: `${localStorage.getItem('iduser')}con_${this.state.name}` });
  }

  onDrop = (picture) => {
    this.setState({
      banner: picture,
    });
  }

  handleSave = () => {
    const {
      name,
      url,
      banner } = this.state;
    let idadmin = localStorage.getItem('iduser');
    let token = localStorage.getItem('JWToken');
    localStorage.setItem('url', this.state.url);
    let formData = new FormData();
    formData.append('banner', banner[0]);
    formData.append('name', name);
    formData.append('url', url.replace(/\s/g,''));
    formData.append('idadmin', idadmin);
    axios.post(`${conf.baseURL}/store/create`, formData, { headers: { 'Authorization': `Bearer ${token}` }, }).then(res => {
      console.log("Respuesta crear Store back: ",res.data);
      let exito = res.data.exito;
      if (!exito) {
        //alert('Intentelo nuevamente');
        toast.error('No se pudo crear el Comercio, intentelo nuevamente',
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        console.log('no exito');
      }
      else {
        console.log(exito);
        this.props.onClose();
        window.location.reload();
      }
    }).catch(function (error) {
      if (error.response.status === 500) {
        toast.error('No se pudo crear el Comercio, intentelo nuevamente',
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error: ', error.message);
      }
      console.log(error.config);
    });
  }

  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value }, () => {
      if (name === 'name') {
        let val = `${localStorage.getItem('iduser')}com_${this.state.name}`.replace(/\s/g, '');
        this.setState({ url: val });
      }
    });
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  render() {

    const campos = [
      { name: 'name', label: 'Nombre', type: 'text' },
      { name: 'url', label: 'Url/Direccion Web', type: 'text' },
      { name: 'banner', label: 'Banner/Imagen', type: 'text' },

    ];

    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <Modal.Header>Crear un Comercio</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Form>
              {campos.map(c => {
                if (c.name === 'url') {
                  return (
                    <Form.Input
                      key={c.name}
                      value={this.state.url}
                      onChange={this.handleInput}
                      name={c.name}
                      label={c.label}
                      type={c.type}
                    />
                  );
                }
                else if (c.name === 'banner') {
                  return (
                    <ImageUploader
                      key={c.name}
                      withIcon={true}
                      buttonText='Choose images'
                      onChange={this.onDrop}
                      imgExtension={['.jpg','jpeg','bmp','.gif','.png', '.gif']}
                      maxFileSize={5242880}
                    />
                  );
                }
                else {
                  return (
                    <Form.Input
                      key={c.name}
                      value={this.state.c}
                      onChange={this.handleInput}
                      name={c.name}
                      label={c.label}
                      type={c.type}
                    />
                  );
                }
              })}
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary
            content='Crear Comercio'
            icon='save'
            onClick={this.handleSave}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default NewStore;
