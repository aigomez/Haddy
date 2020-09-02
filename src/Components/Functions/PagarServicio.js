import React from "react";
import jwt from 'jwt-decode'
import { UsersUrl, PagosUrl } from '../ApiUrls';
import Swal from 'sweetalert2'

import DatosPago from '../Modals/DatosPago'
import DatosPagoTarjeta from '../Modals/DatosPagoTarjeta'

export default class PagarServicio extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: []};
    this.modalDatosPago = React.createRef();
    this.modalDatosPagoTarjeta = React.createRef();
    if (this.props.tokenSitio !== '') { this.IdUser = Object.values(jwt(this.props.tokenSitio))[0]; }
  }

  async componentDidMount() {
    await fetch(`${PagosUrl}`)
    .then(res => res.json())
    .then(json => {
      this.setState({ dataSource: json, id: json.id, razonSocial: json.razonSocial, logo: json.logo, descripcionMetodoPago: json.descripcionMetodoPago, esTarjeta: json.esTarjeta})
    })
    .catch((error) => console.log(error));
  }

  async getDataUser() {
    await fetch(`${UsersUrl}` + this.IdUser)
    .then(res => res.json())
    .then(json => { this.setState({ email: json.email, nombre: json.primerNombre, tarjeta: json.tarjetaCredito, fecha: json.fechaVencimiento, puntosUsuario: json.puntos }) })
    .catch((error) => console.log(error));
  }

  handleOpenModal_DatosPago() { this.modalDatosPago.current.handleOpenModal_DatosPago(); }
  handleOpenModal_DatosPagoTarjeta() { this.modalDatosPagoTarjeta.current.handleOpenModal_DatosPago(); }

  async enviarFactura(esTarjeta) {
    if (this.props.tokenSitio !== '') {
      await this.getDataUser()

      if (esTarjeta === false) { await this.handleOpenModal_DatosPago()}

      else if (this.state.tarjeta !== null && this.state.fecha !== null && this.state.tarjeta !== '' && this.state.fecha !== '' ) { await this.handleOpenModal_DatosPagoTarjeta() }
      else {
        Swal.fire({
            icon: 'error', title: 'Este método de pago require que tengas asociada una tarjeta y su fecha de vencimiento', showConfirmButton: false,
            timer: 3500, timerProgressBar: true, toast: true, position: 'top'
        })
      }

    } else {
      Swal.fire({
          icon: 'error', title: 'Para realizar el pago primero debes ingresar con tu usuario', showConfirmButton: false,
          timer: 3000, timerProgressBar: true, toast: true, position: 'top'
      })
    }
  }

  render() {
    return (
      <div className = "flex">

        <DatosPago
          ref = { this.modalDatosPago } history = { this.props.history }
          idUsuario = { this.IdUser } nomUsuario = { this.state.nombre } puntosUsuario = { this.state.puntosUsuario } email = { this.state.email }
          idServicio = { this.props.idServicio }  nomServicio = { this.props.nombreServicio }
        />

        <DatosPagoTarjeta
          ref = { this.modalDatosPagoTarjeta } history = { this.props.history }
          idUsuario = { this.IdUser } nomUsuario = { this.state.nombre } puntosUsuario = { this.state.puntosUsuario } email = { this.state.email }
          idServicio = { this.props.idServicio }  nomServicio = { this.props.nombreServicio }
        />

        {
         this.state.dataSource.map(pago =>
          <div key = {pago.id} className = "metodos">
            <img onClick = {() => { this.enviarFactura(pago.esTarjeta) }} className = "thumbnail clickable" src = { pago.logo } alt = "" />
          </div>
         )
        }
      </div>
    );
  }
}
