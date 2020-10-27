import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import axios from 'axios';
import { toast } from 'react-toastify';
var conf = require('../../conf');

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      segundo_nombre: '',
      apellido: '',
      segundo_apellido: '',
      correo: '',
      contrasena: '',
      contrasena2: '',
    };
  }

  handleSave = () => {
    const { nombre,
      segundo_nombre,
      apellido,
      segundo_apellido,
      correo,
      contrasena,
      contrasena2 } = this.state;

    if (nombre === '' || apellido === '' || correo === '' || contrasena === '') {
      //alert("Por favor llene los campos obligatorios");
      toast.error('Por favor llene los campos obligatorios',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
    } else if (contrasena !== contrasena2) {
      toast.error('Las contraseñas no coinciden, por favor verifiquelas',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      //alert("Las contraseñas no coinciden, por favor verifiquelas");
    } else {
      axios.post(`${conf.baseURL}/admin/creacion`, {
        nombre,
        segundo_nombre,
        apellido,
        segundo_apellido,
        correo,
        contrasena
      }).then(res => {
        console.log(res.data);
        let exito = res.data.exito;
        if (!exito) {
          console.log(res.data.mensaje);
        }
        else {
          //queda logueado
          let data = res.data;
          localStorage.setItem('JWToken', data.JWToken);
          localStorage.setItem('usuario', data.correo);
          localStorage.setItem('iduser', data.iduser);
          console.log("usuario: ", res.data.correo);
          this.props.verificar();
          this.props.onClose();
        }
      }).catch(err => console.log(err));
    }

  }

  handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }

  render() {

    const campos = [
      { name: 'nombre', label: 'Primer Nombre *', type: 'text' },
      { name: 'segundo_nombre', label: 'Segundo nombre', type: 'text' },
      { name: 'apellido', label: 'Primer Apellido *', type: 'text' },
      { name: 'segundo_apellido', label: 'Segundo apellido', type: 'text' },
      { name: 'correo', label: 'Correo Electronico *', type: 'text' },
      { name: 'contrasena', label: 'Contraseña *', type: 'password' },
      { name: 'contrasena2', label: 'Repetir contraseña *', type: 'password' },
    ];

    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <Modal.Header>Registrarse como administrador</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {/* <Header>{this.props.id}</Header> */}
            <Modal.Header>Los campos marcados con * son obligatorios!!</Modal.Header>
            <Form>
              {campos.map(c => {
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
              })}
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary
            content='Registrar'
            icon='save'
            onClick={this.handleSave}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Register;
