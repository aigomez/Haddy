import React from "react";
import { PagosUrl } from '../ApiUrls'

export default class Footer extends React.Component {
  constructor() {
    super();
    this.state = { dataSource: [] };
  }

  async componentDidMount() {
    await fetch(`${PagosUrl}`)
    .then(res => res.json())
    .then(json => {
      this.setState({ dataSource: json, razonSocial: json.razonSocial, logo: json.logo, descripcionMetodoPago: json.descripcionMetodoPago, esTarjeta: json.esTarjeta})
    })
    .catch((error) => console.log(error));
  }

  render() {
    return (
     <div>
      <div className = "footer m-top">
        <img className = "footer-logo" src = { require('../Imgs/logo.png') } alt = ""/>
        <br />
        <p><label className = "fas fa-envelope" /> haddy.software@gmail.com</p>
        <p><label className = "fas fa-phone-alt" /> 091 901 310</p>
      </div>

      <h3 className = "center m-top">Métodos de pagos</h3>

       <div className = "flex">
         {
          this.state.dataSource.map(pago =>
           <div key = {pago.id} className = "metodos">
             <img className = "thumbnail" src = { pago.logo } alt = ""/>
           </div>
          )
         }
       </div>
     </div>
  );
}
}
