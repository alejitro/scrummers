import React, { Component } from 'react';
import { Button, Form, Modal, Container, Progress, Icon } from 'semantic-ui-react';
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import { toast } from 'react-toastify';
import 'filepond/dist/filepond.min.css';
var conf = require('../../conf.js');


class NewProduct extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      file: [],
      price: 0,
      quantity: 0,
      storeId: '',
      urlstore:'',
      salesPrice: 0,
      progress: 0
    };

  }

  componentDidMount() {
    this.setState({ storeId: this.props.idStore });
  }

  handleSave = () => {
    const {
      name,
      price,
      salesPrice,
      quantity,
      urlstore,
      file,
      attribute,
    } = this.state;
    
    let formData = new FormData();
    formData.append('name', name);
    formData.append('multimedia', file[0]);
    formData.append('price', price);
    formData.append('store', this.props.idStore);
    formData.append('urlstore', this.props.url);
    formData.append('salesprice', salesPrice);
    const config = {
      onUploadProgress: progressEvent => {
        console.log(progressEvent.loaded);
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        let percent = Math.round((progressEvent.loaded * 100) / totalLength);
        this.setState({ progress: percent });
      }
    };
    axios.post(`${conf.baseURL}/product/create`, formData, config)
      .then(res => {
        let Success = res.data.Success;
        if (!Success) {
          toast.error('Algo salio mal. Intentalo nuevamente',
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
        }
        else {
          let formData= new FormData();
          formData.append('attribute', attribute);
          formData.append('product', attribute);
          axios.post(`${conf.baseURL}/product/create`, formData, config).then(resp=>{

          });
          toast.info('Tu producto ha sido creado correctamente',
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          console.log(Success);
          this.props.onClose();
          this.props.refresh();
        }
      })
      .catch(err => {
        console.log(err);
        toast.error('Algo salio mal. Intentalo nuevamente',
          {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
      });
  }

  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value }, () => {
      if (name === 'file') {
        let nameProduct = this.state.file.split('\.');
        let long = nameProduct.length;
        let val = nameProduct[long - 2].split('\\');
        let long2 = val.length;
        let ext = nameProduct[long - 1];
        this.setState({ initFile: val[long2 - 1], extension: ext, file: e.target.files[0] });
      }
    });
  }

  onDrop = (file) => {
    this.setState({
      file: file,
    });
  }

  setAttributes =(c)=>{
    return (
      <Container>
        <Form.Input
          key={c.name}
          value={this.state.c}
          onChange={this.handleInput}
          name={c.name}
          label={c.label}
          type={c.type}
        />
        <Button
          content='Nuevo Comercio'
          icon='plus circle'
          onClick={this.handleStore}
          as='a' 
        />
      </Container>
    );
  }

  render() {
    const campos = [
      { name: 'name', label: 'Nombre', type: 'text' },
      { name: 'price', label: 'Precio', type: 'text' },
      { name: 'salesPrice', label: 'Precio de venta', type: 'text' },
      { name: 'attribute', label: 'Atributo', type: 'text' },
      { name: 'quantity', label: 'Cantidad', type: 'text' },
      { name: 'file', label: 'Contenido multimedia', type: 'file' },
    ];

    return (
      <React.Fragment>

        <Modal open={this.props.open}
          onClose={this.props.onClose}
        >
          <Modal.Header>Crear un Producto</Modal.Header>
          <Modal.Content>
            <Container>
              <Form>
                {campos.map(c => {
                  if (c.type === 'text') {
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
                  else if (c.type === 'file') {
                    return (
                      <ImageUploader
                        key={c.name}
                        withIcon={false}
                        label='Max file size: 10MB'
                        buttonText='Seleccionar archivo'
                        onChange={this.onDrop}
                        imgExtension={['mp3', 'midi', 'ogg', 'm4a', 'wav','mp4','avi','wmv','flv','mov','jpeg','jpg', 'png']}
                        accept='*/*'
                        maxFileSize={10485760}
                        singleImage
                      />
                    );
                  }else if (c.name === 'attribute') {
                    this.setAttributes(c);
                  }
                  
                })}
              </Form>
              {this.state.progress !== 0 ?
                <Progress percent={this.state.progress}
                  progress
                  active
                  color='teal'
                >Subiendo Producto... Espera</Progress> : <div></div>}
            </Container>
          </Modal.Content>
          <Modal.Actions>
            <Button primary
              content='Subir Producto'
              icon='save'
              onClick={this.handleSave}
            />
          </Modal.Actions>

        </Modal>
      </React.Fragment>
    );
  }
}

export default NewProduct;
