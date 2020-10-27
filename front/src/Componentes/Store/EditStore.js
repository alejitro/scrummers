import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import { toast } from 'react-toastify';
var conf = require('../../conf');

class EditStore extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      url: '',
      banner: [],
      idstore: '',
    };
  }

  getStoreData = () => {
    axios.get(`${conf.baseURL}/store/get/url/${this.props.urlStore}`)
      .then(res => {
        let datos = res.data[0];
        console.log(datos);
        this.setState({ info: datos });
        /*this.setState({
          idstores: res.data[0].idstores,
          name: res.data[0].name,
          fecha_inicio: res.data[0].fecha_inicio,
          fecha_fin: res.data[0].fecha_fin,
          valor: res.data[0].valor,
          guion: res.data[0].guion,
          recomendaciones: res.data[0].recomendaciones,
          url: res.data[0].url,
          banner: res.data[0].banner,
          info: {},
        });*/
      }).catch(err => console.log(err));

  }

  componentWillReceiveProps(nextProps) {
    this.getStoreData();
    if (this.props.infoStore !== nextProps.infoStore) {
      this.setState({
        name: nextProps.infoStore.name,
        url: nextProps.infoStore.url,
        banner: nextProps.infoStore.banner,
        idstore: nextProps.infoStore.id,
      });
    }
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
    formData.append('idstore', this.props.infoStore.id);
    formData.append('name', name);
    formData.append('url', url.replace(/\s/g,''));
    formData.append('idadmin', idadmin);
    formData.append('banner', banner[0]);
    axios.put(`${conf.baseURL}/store/edit`,formData, { headers: { 'Authorization': `Bearer ${token}` }, })
      .then(res => {
        console.log(res.data);
        let exito = res.data.exito;
        if (!exito) {
          toast.error('Algo salio mal. Intentalo nuevamente',
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
          toast.info('Tu comercio ha sido actualizado.',
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          this.props.updateUrl(url);
          this.props.onClose();
          this.props.refrescar();
          console.log(exito);
        }
      }).catch(function (error) {
        if (error.response.status === 500) {
          //alert("No se pudo crear el concurso, intentelo nuevamente");
          toast.error('Algo salio mal. Intentalo nuevamente',
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
      { name: 'name', label: 'Nombre', type: 'text', value: this.state.name },
      { name: 'url', label: 'Url/Direccion Web', type: 'text' },
      { name: 'banner', label: 'Banner/Imagen', type: 'file' },

    ];


    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <Modal.Header>Editar Comercio {this.state.name}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {/* <Header>{this.props.id}</Header> */}
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
                      imgExtension={['.jpg','jpeg','bmp', '.gif', '.png', '.gif']}
                      maxFileSize={5242880}
                    />
                  );
                }
                else {
                  return (
                    <Form.Input
                      key={c.name}
                      value={c.value}
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
            content='Editar Comercio'
            icon='save'
            onClick={this.handleSave}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default EditStore;
