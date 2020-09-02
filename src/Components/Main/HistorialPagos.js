import React from "react";
import cookie from 'react-cookies'
import jwt from 'jwt-decode'
import { HistorialPagoPorUsuarioUrl, UsersUrl } from '../ApiUrls';
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';

export default class HistorialPagos extends React.Component {
  constructor() {
    super();
    this.state = { tokenSitio: cookie.load('tokenSitio') || '', dataSource: [], isLoading: true };
    if (this.state.tokenSitio !== '') { this.IdUser = Object.values(jwt(this.state.tokenSitio))[0] }
  }

  componentDidMount() {
    if (this.IdUser) {

      fetch(`${UsersUrl}` + this.IdUser)
        .then(res => res.json())
        .then(json => { this.setState({ puntosUsuario: json.puntos }) })
        .catch((error) => console.log(error));

      fetch(`${HistorialPagoPorUsuarioUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: this.IdUser })
      })

      .then(res => res.json())
      .then(json => {
        if (json.Error) { this.setState({ dataSource: 'No hay resultados', isLoading: false }) }
        else { this.setState({ dataSource: json, isLoading: false }) }
      })
    }

    else { this.setState({ dataSource: 'No hay resultados', isLoading: false }) }
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <div className = "loading-items center">
          <Spinner />
        </div>
      )

    } else {
      return (
        <div>
          {
           this.state.dataSource !== 'No hay resultados'?
             <div>
                <p className = "center puntos">
                  <label className = "fas fa-star" /> Tenés { this.state.puntosUsuario } puntos!
                </p>

                {
                 this.state.dataSource.map(factura =>
                  <div className = "flex historial-pagos m-top" key = {factura.id}>
                    <span className = "historial-factura"> <label className = "fas fa-money-check" /> { factura.nFactura }</span>
                    <span className = "historial-nombre"> { factura.nomServicio }</span>
                    <span className = "icon-venta-dolar"> <label className = "fas fa-dollar-sign" /> { factura.total }</span>
                    <span className = "historial-fecha"> <label className = "fas fa-calendar" /> { factura.fechaPago }</span>
                  </div>
                )
               }
            </div>
           :
           <div className = "sin-facturas flex">Todavía no hiciste ningun pago</div>
          }
        </div>
      );
    }
  }
}
