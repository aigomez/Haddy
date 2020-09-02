import React from "react";
import { Link } from 'react-router-dom';

export default class Envio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className = "envio">
        <div className = "envio flex">
          <img className = "envio-logo" src = { require('../Imgs/envio.jpg') } alt = ""/>
        </div>

        <div className = "envio-texto">
          <p>Gracias por utilizar Haddy, se envió un informe a tu casilla de correos!</p>
          <br />
          <Link to = { '/historial/' }>
            <p>Historial de transacciones</p>
          </Link>
        </div>
      </div>
   );
  }
}
