import React from "react";
import ReactModal from 'react-modal';
import cookie from 'react-cookies'
import jwt from 'jwt-decode'
import { UsersUrl } from '../ApiUrls'
import NewPassword from './NewPassword'
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import Swal from 'sweetalert2'

import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { subDays } from 'date-fns';
registerLocale("es", es);

export default class Data extends React.Component {
  constructor() {
    super();

    this.state = {
      tokenSitio: cookie.load('tokenSitio') || '',
      email: '',
      direccion: '',
      nombre: '',
      apellido: '',
      isLoadingModal: true,
    }

    this.IdUser = Object.values(jwt(this.state.tokenSitio))[0];
  }

  handleOpenModal_Data = () => {
    this.setState({ showModal_Data: true });
    document.body.style.overflow = "hidden";
  }

  handleCloseModal_Data = () => {
    this.setState({ showModal_Data: false });
    document.body.style.overflowY = "scroll";
  }

  async onPreFill () {
    await fetch(`${UsersUrl}` + this.IdUser)
    .then(res => res.json())
    .then(json => {
      this.setState({
        nombre: json.primerNombre, apellido: json.primerApellido, email: json.email,
        direccion: json.direccion, tarjeta: json.tarjetaCredito, fecha: new Date(json.fechaVencimiento), isLoadingModal: false })
    })
    .catch((error) => console.log(error));
  }

  async onSubmit (event) {
    event.preventDefault();
    await this.setState({ isLoading: true })

    if (this.state.nombre === '' || this.state.apellido === '' || this.state.email === '' || this.state.direccion === '') {
      Swal.fire({
        icon: 'error', title: 'Tu nombre completo, email y dirección son obligatorios', showConfirmButton: false,
        timer: 3000, timerProgressBar: true, toast: true, position: 'top'
      })

      await this.setState({ isLoading: false })
    }

    else {
      await fetch(`${UsersUrl}` + this.IdUser + '/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.state.email, direccion: this.state.direccion,
          primerNombre: this.state.nombre, primerApellido: this.state.apellido,
          tarjetaCredito: this.state.tarjeta, fechaVencimiento: this.state.fecha })
      })

      .then(res => res.json())
      .then(json => {
        if (json.id > 0) {
          Swal.fire({
              icon: 'success', title: 'Datos modificados correctamente', showConfirmButton: false,
              timer: 1500, timerProgressBar: true, toast: true, position: 'top'
          })
          this.setState({ isLoading: false });

        } else {
          Swal.fire({
            icon: 'error', title: 'Tu email no tiene un formato válido', showConfirmButton: false,
            timer: 2000, timerProgressBar: true, toast: true, position: 'top'
          })
          this.setState({ isLoading: false });
        }
      })
    }
  }

  onDelete (event) {
    event.preventDefault();
    Swal.fire({
      icon: 'warning', title: 'Estas seguro?', confirmButtonText: 'Si', cancelButtonText: 'No', showCancelButton: true,
      confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', toast: true, position: 'top'
    })

      .then((result) => {
        if (result.value) {
          fetch(`${UsersUrl}` + this.IdUser, { method: 'DELETE' })
            .then(res => res.json())
            .catch((error) => console.log(error))

          Swal.fire({
              icon: 'success', title: 'Tu cuenta fue eliminada satisfactoriamente', showConfirmButton: false,
              timer: 2000, timerProgressBar: true, toast: true, position: 'top'
          })

          cookie.remove('tokenSitio', { path: '/' })
          this.props.isLogged('')
        }
    })
  }

  async onlyLetters(event) {
    const re = /[a-zA-Z_ ]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
  }

  async onlyNumbers(event) {
    const re = /[0-9]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
  }

  async onlyLettersNumbers(event) {
    const re = /[0-9a-zA-Z_ ]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
  }

  render() {
    return (
      <div>
        <button className = "icons btn-join" onClick={() => { this.handleOpenModal_Data(); this.onPreFill() }}>
           <i className = "fas fa-user-circle" />
        </button>

        <ReactModal
          isOpen = { this.state.showModal_Data }
          contentLabel = "Data"
          ariaHideApp = {false}
          className = "Modal Modal-Data"
          overlayClassName = "Overlay"
          onRequestClose = { this.handleCloseModal_Data }
        >

        {
          this.state.isLoadingModal === true?
            <div className = "loading-items center">
              <Spinner />
            </div>
          :
          <div>
            <button className = "btn-Close" onClick = { this.handleCloseModal_Data }>×</button>

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

              <label className = "new-icon fas fa-home" />
              <input
                placeholder = "Dirección"
                value = {this.state.direccion}
                onChange = {(event) => this.setState({ direccion: event.target.value })}
                onKeyPress = {(event) => this.onlyLettersNumbers(event)}
                className = "input"
              />

              <br />

              <label className = "new-icon fas fa-credit-card" />
              <input
                placeholder = "Tarjeta de débito / crédito"
                value = {this.state.tarjeta}
                onChange = {(event) => this.setState({ tarjeta: event.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ') })}
                onKeyPress = {(event) => this.onlyNumbers(event)}
                className = "input"
                maxLength = "19"
              />

              <br />
              <div className = "calDiv">
                <label className = "new-icon fas fa-calendar-alt" />
                <DatePicker
                  selected = {this.state.fecha}
                  onChange = {date => this.setState({ fecha: date })}
                  dateFormat = "LLLL yyyy"
                  showMonthYearPicker
                  showTwoColumnMonthYearPicker
                  minDate={subDays(new Date(), 30)}
                  calendarClassName = "calInside"
                  customInput = {<Input />}
                  isClearable
                  locale = "es"
                />
              </div>

              {
                this.state.isLoading === true?
                <button className = "btn-Submit"><Spinner color = 'white'/></button>
                :
                <button className = "btn-Submit" onClick = {(event) => this.onSubmit(event) }> Cambiar Datos </button>
              }

              <br />
              <br />

              <NewPassword idUser = { this.idUser } />

              <br />

              {
                this.state.isLoadingDelete === true?
                <button className = "btn-Submit danger"><Spinner color = 'white'/></button>
                :
                <button className = "btn-Submit danger" onClick = {(event) => this.onDelete(event) }> Eliminar mi cuenta </button>
              }
            </form>
          </div>
        }
        </ReactModal>
      </div>
    );
  }
}

const Input = ({ value, onClick }) => (
  <input placeholder = "Fecha de vencimiento" className = "input calInput" onClick={onClick} value = {value} />
);
