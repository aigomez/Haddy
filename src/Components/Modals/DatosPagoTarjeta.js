import React from "react";
import ReactModal from 'react-modal';
import { HistorialPagoUrl, UsersUrl } from '../ApiUrls'
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import Swal from 'sweetalert2'

export default class DatosPagoTarjeta extends React.Component {
  constructor() {
    super();

    this.state = {
      nFactura: '',
      total: '',
      puntosGanados: 0
    }
  }

  handleOpenModal_DatosPago = () => {
    this.setState({ showModal_DatosPago: true });
    document.body.style.overflow = "hidden";
  }

  handleCloseModal_DatosPago = () => {
    this.setState({ showModal_DatosPago: false });
    document.body.style.overflowY = "scroll";
  }

  async sumarPuntos() {
    await fetch(`${UsersUrl}` + this.props.idUsuario + '/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puntos: this.props.puntosUsuario + 20 })
    })
  }

  async email() {
    window.emailjs.send('gmail', 'template_c6OUAYpD',

    { usuario: this.props.nomUsuario, send_to: this.props.email, servicio: this.props.nombreServicio, total: this.state.total, puntosGanados: 20 })
    .then(res => { this.sumarPuntos() })
  }

  async onSubmit () {
    if (this.state.nFactura === '' || this.state.total === '') {
      Swal.fire({
        icon: 'error', title: 'Campos vacíos', showConfirmButton: false,
        timer: 1500, timerProgressBar: true, toast: true, position: 'top'
      })
    }

    else {
      await this.setState({ isLoading: true })
      await fetch(`${HistorialPagoUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: this.props.idUsuario, idServicio: this.props.idServicio, nomUsuario: this.props.nomUsuario,
          nomServicio: this.props.nomServicio, nFactura: this.state.nFactura, total: this.state.total
        })
      })

      .then(res => res.json())
      .then(json => {
        this.email()
        this.handleCloseModal_DatosPago()
        this.setState({ nFactura: "", total: "", isLoading: false })
        this.props.history.push('/envio/')
      })
    }
  }

  async onlyLettersNumbers(event) {
    const re = /[0-9a-zA-Z]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
  }

  async onlyNumbers(event) {
    const re = /[0-9]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
  }

  render() {
    return (

      <div>
        <ReactModal
          isOpen = { this.state.showModal_DatosPago }
          contentLabel = "DatosPago"
          ariaHideApp = {false}
          className = "Modal"
          overlayClassName = "Overlay"
          onRequestClose = { this.handleCloseModal_DatosPago }
        >

          <div className = "center">
            <button className = "btn-Close" onClick = { this.handleCloseModal_DatosPago }>×</button>

            <br />

            <label className = "icon-top new-icon fas fa-money-check" />
            <input
              placeholder = "N° Factura"
              value = {this.state.nFactura}
              onChange = {(event) => this.setState({ nFactura: event.target.value })}
              onKeyPress = {(event) => this.onlyLettersNumbers(event)}
              className = "input"
            />

            <br />

            <div className = "inside-input">
              <label className = "new-icon fas fa-dollar-sign" />
              <input
                placeholder = "Monto"
                value = {this.state.total}
                onChange = {(event) => this.setState({ total: event.target.value })}
                onKeyPress = {(event) => this.onlyNumbers(event)}
                type = "number"
                min = "0"
                className = "input"
              />
            </div>

            <br />

            <div className = "inside-input">
              <label className = "new-icon fas fa-info-circle" />
              <input
                placeholder = "PIN tarjeta"
                value = {this.state.pin}
                onChange = {(event) => this.setState({ pin: event.target.value })}
                onKeyPress = {(event) => this.onlyNumbers(event)}
                type = "number"
                min = "0"
                className = "input"
              />
            </div>

            <br />

            {
              this.state.isLoading === true?
              <button className = "btn-Submit"><Spinner color = 'white'/></button>
              :
              <button className = "btn-Submit" onClick = {() => this.onSubmit() }> Pagar </button>
            }
          </div>
        </ReactModal>
      </div>
    );
  }
}
