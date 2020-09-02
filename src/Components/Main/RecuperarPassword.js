import React from "react";
import { RecuperarPasswordUrl } from '../ApiUrls';
import { withRouter } from "react-router-dom";
import Swal from 'sweetalert2'

class RecuperarPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      codigo: '',
      email: '',
      password: '',
      passwordConfirm: '',
      type: 'password',
      // typePConfirm: 'password',
    };
  }

  async recuperarPassword () {
    if (this.state.codigo === '' || this.state.email === '' || this.state.password === '') {
      Swal.fire({
        icon: 'error', title: 'Campos vacíos', showConfirmButton: false,
        timer: 1500, timerProgressBar: true, toast: true, position: 'top'
      })
    }

    else {
      await fetch(`${RecuperarPasswordUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigoRecuperarPassword: this.state.codigo, email: this.state.email, password: this.state.password })
      })

      .then(res => res.json())
      .then(json => {
        if (json.Code === "3") {
          Swal.fire({
              icon: 'success', title: JSON.stringify(json.Exito), showConfirmButton: false,
              timer: 3000, timerProgressBar: true, toast: true, position: 'top'
          })
          this.setState({ codigo: "", email: "", password: "" })
          this.props.history.push('/')

        } else {
          Swal.fire({
              icon: 'error', title: JSON.stringify(json.Error), showConfirmButton: false,
              timer: 3000, timerProgressBar: true, toast: true, position: 'top'
          })
        }
      })
    }
  }

  showHide(e) { this.setState({ type: this.state.type === 'input' ? 'password' : 'input' }) }
  // showHidePConfirm(e) { this.setState({ typePConfirm: this.state.typePConfirm === 'input' ? 'password' : 'input' }) }

  render() {
    return (
      <div className = "m-top recuperarPassword">
        <label className = "fas fa-info-circle" />
        <input
          placeholder = "Codigo"
          value = {this.state.codigo}
          onChange = {(event) => this.setState({ codigo: event.target.value })}
          className = "input"
        />

        <br />

        <label className = "fas fa-pen-alt" />
        <input
          placeholder = "Email"
          value = {this.state.email}
          onChange = {(event) => this.setState({ email: event.target.value })}
          className = "input"
        />

        <br />

        <div className = "inside-input">
          <label className = "fas fa-key" />
          <input
            type = {this.state.type}
            placeholder = "Nueva Contraseña"
            value = {this.state.password}
            onChange = {(event) => this.setState({ password: event.target.value })}
            className = "input"
          />

          <span onClick = {() => this.showHide()}>
            {this.state.type === 'password' ?
            <i className = "fas fa-eye" /> : <i className = "new-icon fas fa-eye-slash" />}
          </span>
        </div>

        {/*<br />

        <div className = "inside-input">
          <label className = "fas fa-key" />
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
        </div> */}

        <br />

        <button className = "btn-Submit" onClick = {() => this.recuperarPassword() }> Recuperar Contraseña </button>
      </div>
    );
  }
}

export default withRouter(RecuperarPassword)
