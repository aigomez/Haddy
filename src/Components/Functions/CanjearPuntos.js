import React from "react";
import jwt from 'jwt-decode'
import { UsersUrl } from '../ApiUrls';
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import Swal from 'sweetalert2'

export default class CanjearPuntos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (this.props.tokenSitio !== '') { this.IdUser = Object.values(jwt(this.props.tokenSitio))[0]; }
  }

  async getDataUser() {
    await fetch(`${UsersUrl}` + this.IdUser)
    .then(res => res.json())
    .then(json => { this.setState({ email: json.email, nombre: json.primerNombre, puntosUsuario: json.puntos }) })
    .catch((error) => console.log(error));
  }

  async setPuntos() {
    await this.setState({
      totalPuntos: this.props.puntos * this.props.stock,
      contenidoEmail: this.props.nombre + ' x' + this.props.stock
    });
  }

  async restarPuntos() {
    await fetch(`${UsersUrl}` + this.IdUser + '/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puntos: this.state.puntosUsuario - this.state.totalPuntos })
    })
  }

  async enviarFactura() {
    if (this.props.tokenSitio !== '') {
      await this.setState({ isLoading: true })
      await this.getDataUser()
      await this.setPuntos()

      if (this.state.puntosUsuario >= this.state.totalPuntos ) {

        await this.restarPuntos()

        window.emailjs.send('gmail', 'templateCanjePuntos',
        { usuario: this.state.nombre, send_to: this.state.email, contenidoEmail: this.state.contenidoEmail, totalPuntos: this.state.totalPuntos })

        .then(res => { this.props.history.push('/envio/') })

      } else {
        Swal.fire({
            icon: 'error', title: 'Te faltan puntos para el canje, tenés: ' + this.state.puntosUsuario, showConfirmButton: false,
            timer: 3000, timerProgressBar: true, toast: true, position: 'top'
        })
        await this.setState({ isLoading: false }) }
    } else {
      Swal.fire({
          icon: 'error', title: 'Para realizar el canje primero debes ingresar con tu usuario', showConfirmButton: false,
          timer: 3000, timerProgressBar: true, toast: true, position: 'top'
      })
    }
  }

  render() {
    return (
      <div>
        {
          this.state.isLoading === true?
            <p className = "btns-venta btn-puntos btn-spinner"> <Spinner color = 'white'/> </p>
          :
            <p className = "btns-venta btn-puntos" onClick = {() => this.enviarFactura()} >Canjear por puntos</p>
        }
      </div>
    );
  }
}
