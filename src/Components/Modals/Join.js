import React from "react";
import ReactModal from 'react-modal';
import { UsersUrl } from '../ApiUrls'
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import Swal from 'sweetalert2'

export default class Join extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      direccion: '',
      nombre: '',
      apellido: '',
      type: 'password',
      typePConfirm: 'password',
    }
  }

  handleOpenModal_Join = () => {
    this.setState({ showModal_Join: true });
    document.body.style.overflow = "hidden";
  }

  handleCloseModal_Join = () => {
    this.setState({ showModal_Join: false });
    document.body.style.overflowY = "scroll";
  }

  async onSubmit (event) {
    event.preventDefault();
    if (this.state.password !== this.state.passwordConfirm || this.state.password.length < 8) {
      Swal.fire({
          icon: 'error', title: 'Las contraseñas no coinciden o deben contener al menos 8 caracteres', showConfirmButton: false,
          timer: 3500, timerProgressBar: true, toast: true, position: 'top'
      })
    }

    else {
      await this.setState({ isLoading: true })
      await fetch(`${UsersUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.state.email, password: this.state.password, direccion: this.state.direccion,
          primerNombre: this.state.nombre, primerApellido: this.state.apellido })
      })

      .then(res => res.json())
      .then(json => {
        if (json.id > 0) {
          // cookie.save('tokenSitio', json.token, {path: '/'});
          // this.props.isLogged('isLogged')
          Swal.fire({
              icon: 'success', title: 'Usuario creado satisfactoriamente, ya puede ingresar al sistema', showConfirmButton: false,
              timer: 3300, timerProgressBar: true, toast: true, position: 'top'
          })
          this.setState({ email: "", password: "", passwordConfirm: "", direccion: "",  nombre: "", apellido: "", isLoading: false });
          this.handleCloseModal_Join();
        }
        else {
          Swal.fire({
            icon: 'error', title: 'Tu email no tiene un formato válido o ya se encuentra en uso', showConfirmButton: false,
            timer: 3000, timerProgressBar: true, toast: true, position: 'top'
          })
          this.setState({ isLoading: false });
        }
      })
    }
  }

  async onlyLetters(event) {
    const re = /[a-zA-Z_ ]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
  }

  async onlyLettersNumbers(event) {
    const re = /[0-9a-zA-Z_ ]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
  }

  showHide(e) { this.setState({ type: this.state.type === 'input' ? 'password' : 'input' }) }
  showHidePConfirm(e) { this.setState({ typePConfirm: this.state.typePConfirm === 'input' ? 'password' : 'input' }) }

  render() {
    return (

      <div className = "">
        <button className = "btn-join" onClick = { this.handleOpenModal_Join }>
          <span className = "fas fa-user"/>
          <span> Unirse </span>
        </button>

        <ReactModal
          isOpen = { this.state.showModal_Join }
          contentLabel = "Join"
          ariaHideApp = {false}
          className = "Modal"
          overlayClassName = "Overlay"
          onRequestClose = { this.handleCloseModal_Join }
        >

          <div>
            <button className = "btn-Close" onClick = { this.handleCloseModal_Join }>×</button>

            <br />

            <form>
              <label className = "icon-top new-icon fas fa-signature" />
              <input
                placeholder = "Nombre"
                value = {this.state.nombre}
                onChange = {(event) => this.setState({ nombre: event.target.value })}
                onKeyPress = {(event) => this.onlyLetters(event)}
                className = "input"
              />

              <br />

              <label className = "icon-top new-icon fas fa-pen-alt" />
              <input
                placeholder = "Apellido"
                value = {this.state.apellido}
                onChange = {(event) => this.setState({ apellido: event.target.value })}
                onKeyPress = {(event) => this.onlyLetters(event)}
                className = "input"
              />

              <br />

              <label className = "icon-top new-icon fas fa-envelope" />
              <input
                placeholder = "Email"
                value = {this.state.email}
                onChange = {(event) => this.setState({ email: event.target.value })}
                className = "input"
                type = "email"
              />

              <br />

              <div className = "inside-input">
                <label className = "new-icon fas fa-key" />
                <input
                  type = {this.state.type}
                  placeholder = "Contraseña"
                  value = {this.state.password}
                  onChange = {(event) => this.setState({ password: event.target.value })}
                  className = "input"
                />

                <span onClick = {() => this.showHide()}>
                  {this.state.type === 'password' ?
                  <i className = "fas fa-eye" /> : <i className = "new-icon fas fa-eye-slash" />}
                </span>
              </div>

              <br />

              <div className = "inside-input">
                <label className = "new-icon fas fa-key" />
                <input
                  type = {this.state.typePConfirm}
                  placeholder = "Confirmación de Contraseña"
                  value = {this.state.passwordConfirm}
                  onChange = {(event) => this.setState({ passwordConfirm: event.target.value })}
                  className = "input"
                />

                <span onClick = {() => this.showHidePConfirm()}>
                  {this.state.typePConfirm === 'password' ?
                  <i className = "fas fa-eye" /> : <i className = "new-icon fas fa-eye-slash" />}
                </span>
              </div>

              <br />

              <label className = "new-icon fas fa-home" />
              <input
                placeholder = "Dirección"
                value = {this.state.direccion}
                onChange = {(event) => this.setState({ direccion: event.target.value })}
                onKeyPress = {(event) => this.onlyLettersNumbers(event)}
                className = "input"
              />

              <br />

              {
                this.state.isLoading === true?
                <button className = "btn-Submit"><Spinner color = 'white'/></button>
                :
                <button className = "btn-Submit" onClick = {(event) => this.onSubmit(event) }> Unirse </button>
              }
            </form>
          </div>
        </ReactModal>
      </div>
    );
  }
}
