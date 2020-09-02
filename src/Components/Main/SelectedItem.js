import React from "react";
import { ItemsUrl } from '../ApiUrls';
import { withRouter } from "react-router-dom";
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';

import CanjearPuntos from '../Functions/CanjearPuntos'

class SelectedItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      stock: 1,
      isLoading: true
    };
  }

  async componentDidMount() {
    await fetch(`${ItemsUrl}` + this.state.id)
      .then(res => res.json())
      .then(json => {
        this.setState({ img: json.enlaceImagen, nombre: json.nombreProducto, descripcion: json.descProducto, puntos: json.puntos, isLoading: false }) })
      .catch((error) => console.log(error));
  }

  async onlyNumbers(event) {
    const re = /[0-9]+/g;
    if (!re.test(event.key)) { event.preventDefault(); }
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
        <div className = "selected-item flex m-top">
          <div key = {this.state.id} className = "info-item">
            <img src = {this.state.img} className = "thumbnail-item" draggable = "false" alt = "" />
            <p className = "nombre"> { this.state.nombre }</p>
            <p className = "descripcion"> { this.state.descripcion }</p>
          </div>

          <div className = "venta">
            <p className = "icon-venta-puntos">
              <label className = "fas fa-star" /> { this.state.puntos * this.state.stock}
            </p>

            <div>
              <label className = "fas fa-box m-right" />
              <input
                className = "stock"
                type = "number"
                maxLength = "3"
                min = "1"
                value = { this.state.stock }
                onChange = {(event) => this.setState({ stock: event.target.value })}
                onKeyPress = {(event) => this.onlyNumbers(event)}
              />
            </div>

            <CanjearPuntos id = { this.state.id } history = { this.props.history } tokenSitio = { this.props.tokenSitio }
              img = { this.state.img } nombre = { this.state.nombre } stock = { this.state.stock } puntos = { this.state.puntos }
            />
          </div>
        </div>
      );
    }
  }
}

export default withRouter(SelectedItem)
