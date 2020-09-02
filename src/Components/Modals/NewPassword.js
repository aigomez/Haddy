import React from "react";
import cookie from 'react-cookies'
import jwt from 'jwt-decode'
import { ChangePasswordUrl } from '../ApiUrls'
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import Swal from 'sweetalert2'

export default class NewPassword extends React.Component {
  constructor() {
    super();

    this.state = {
      tokenSitio: cookie.load('tokenSitio') || '',
      password: '',
      passwordNew: '',
      passwordConfirm: '',
      type: 'password',
      typePNew: 'password',
      typePConfirm: 'password',
    }

    this.IdUser = Object.values(jwt(this.state.tokenSitio))[0];
  }

  async changePassword (event) {
    event.preventDefault();
    if (this.state.passwordConfirm !== this.state.passwordNew || this.state.passwordNew.length < 8) {
      Swal.fire({
          icon: 'error', title: 'Las contraseñas no coinciden o deben contener al menos 8 caracteres', showConfirmButton: false,
          timer: 3500, timerProgressBar: true, toast: true, position: 'top'
      })
    }

    else {
      await this.setState({ isLoading: true })
      await fetch(`${ChangePasswordUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: this.IdUser, passwordVieja: this.state.password, passwordNueva: this.state.passwordNew })
      })

      .then(res => res.json())
      .then(json => {
        if (json.Code === "4") {
          Swal.fire({
              icon: 'success', title: JSON.stringify(json.Exito), showConfirmButton: false,
              timer: 3000, timerProgressBar: true, toast: true, position: 'top'
          })
          this.setState({ password: "", passwordNew: "", passwordConfirm: "", isLoading: false });

        } else {
          Swal.fire({
              icon: 'error', title: JSON.stringify(json.Error), showConfirmButton: false,
              timer: 3000, timerProgressBar: true, toast: true, position: 'top'
          })
          this.setState({ isLoading: false });
        }
      })
      .catch((error) => console.log(error));
    }
  }

  showHide(e) { this.setState({ type: this.state.type === 'input' ? 'password' : 'input' }) }
  showHidePNew(e) { this.setState({ typePNew: this.state.typePNew === 'input' ? 'password' : 'input' }) }
  showHidePConfirm(e) { this.setState({ typePConfirm: this.state.typePConfirm === 'input' ? 'password' : 'input' }) }

  render() {
    return (
      <div>
        <form>
          <div className = "inside-input">
            <label className = "new-icon fas fa-key" />
            <input
              type = {this.state.type}
              placeholder = "Contraseña Actual"
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
              type = {this.state.typePNew}
              placeholder = "Nueva Contraseña"
              value = {this.state.passwordNew}
              onChange = {(event) => this.setState({ passwordNew: event.target.value })}
              className = "input"
            />

            <span onClick = {() => this.showHidePNew()}>
              {this.state.typePNew === 'password' ?
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

          {
            this.state.isLoading === true?
            <button className = "btn-Submit"><Spinner color = 'white'/></button>
            :
            <button className = "btn-Submit" onClick = {(event) => this.changePassword(event) }> Cambiar Contraseña </button>
          }
        </form>
      </div>
    );
  }
}
