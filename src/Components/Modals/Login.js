import React from "react";
import ReactModal from 'react-modal';
import cookie from 'react-cookies'
import { LoginUrl, SolicitarPasswordUrl } from '../ApiUrls'
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import Swal from 'sweetalert2'

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      type: 'password'
    }
  }

  handleOpenModal_Login = () => {
    this.setState({ showModal_Login: true });
    document.body.style.overflow = "hidden";
  }

  handleCloseModal_Login = () => {
    this.setState({ showModal_Login: false });
    document.body.style.overflowY = "scroll";
  }

  async solicitarPassword (event) {
    event.preventDefault();
    if (this.state.email === '') {
      Swal.fire({
        icon: 'info', title: 'Por favor ingresa tu email', showConfirmButton: false,
        timer: 1500, timerProgressBar: true, toast: true, position: 'top'
      })
    }

    else {
      await this.setState({ isLoadingRPass: true })
      await fetch(`${SolicitarPasswordUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.state.email })
      })

      .then(res => res.json())
      .then(json => {
        Swal.fire({
            icon: 'success', title: 'Se te envió un código de recuperación a tu email', showConfirmButton: false,
            timer: 3000, timerProgressBar: true, toast: true, position: 'top'
        })
          this.setState({ email: "", isLoadingRPass: false });
          this.handleCloseModal_Login();
      })
    }
  }

  async onSubmit (event) {
    event.preventDefault();
    if (this.state.email === '' || this.state.password === '') {
      Swal.fire({
        icon: 'error', title: 'Campos vacíos', showConfirmButton: false,
        timer: 1500, timerProgressBar: true, toast: true, position: 'top'
      })
    }

    else {
      await this.setState({ isLoading: true })
      await fetch(`${LoginUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.state.email, password: this.state.password })
      })

      .then(res => res.json())
      .then(json => {
        if (json.token) {
          cookie.save('tokenSitio', json.token, {path: '/'});
          this.setState({ email: "", password: "", isLoading: false });
          this.props.isLogged('isLogged')
          this.handleCloseModal_Login();

        } else {
          Swal.fire({
            icon: 'error', title: 'Datos incorrectos', showConfirmButton: false,
            timer: 1500, timerProgressBar: true, toast: true, position: 'top'
          })
          this.setState({ isLoading: false });
        }
      })
    }
  }

  showHide(e) { this.setState({ type: this.state.type === 'input' ? 'password' : 'input' }) }

  render() {
    return (

      <div>
        <button className = "btn-login" onClick = { this.handleOpenModal_Login }>
          <span className = "fas fa-user"/>
          <span> Ingresar </span>
        </button>

        <ReactModal
          isOpen = { this.state.showModal_Login }
          contentLabel = "Login"
          ariaHideApp = {false}
          className = "Modal"
          overlayClassName = "Overlay"
          onRequestClose = { this.handleCloseModal_Login }
        >

          <div className = "center">
            <button className = "btn-Close" onClick = { this.handleCloseModal_Login }>×</button>

            <br />

            <form>
              <label className = "icon-top new-icon fas fa-envelope" />
              <input
                placeholder = "Email"
                value = {this.state.email}
                onChange = {(event) => this.setState({ email: event.target.value })}
                className = "input"
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

              {
                this.state.isLoading === true?
                <button className = "btn-Submit"><Spinner color = 'white'/></button>
                :
                <button className = "btn-Submit" onClick = {(event) => this.onSubmit(event) }> Ingresar </button>
              }

              <br />

              {
                this.state.isLoadingRPass === true?
                <button className = "btn-Submit btn-RecuperarPassword"><Spinner color = 'white'/></button>
                :
                <button className = "btn-Submit btn-RecuperarPassword" onClick = {(event) => this.solicitarPassword(event) }> Recuperar Contraseña </button>
              }
            </form>
          </div>
        </ReactModal>
      </div>
    );
  }
}
