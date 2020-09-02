import React from "react";
import { ServiciosUrl } from '../ApiUrls';
import { withRouter } from "react-router-dom";
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';

import PagarServicio from '../Functions/PagarServicio'

class SelectedServicio extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    fetch(`${ServiciosUrl}` + this.props.match.params._id)
      .then(res => res.json())
      .then(json => {
        this.setState({ nombreServicio: json.nombreServicio, enlaceImagen: json.enlaceImagen, descripcionServicio: json.descripcionServicio, isLoading: false }) })
      .catch((error) => console.log(error));
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params._id !== prevProps.match.params._id) {
      this.setState({ isLoading: true })
      this.componentDidMount();
    }
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
        <div className = "selected-servicio flex m-top">
          <div key = {this.state.id} className = "info-servicio m-top">
            <img src = {this.state.enlaceImagen} className = "thumbnail-servicio" draggable = "false" alt = "" />
            <p className = "descripcion m-top"> { this.state.descripcionServicio }</p>
          </div>

          <div>
            <PagarServicio idServicio = { this.props.match.params._id } history = { this.props.history }
             tokenSitio = { this.props.tokenSitio } nombreServicio = { this.state.nombreServicio }
            />
          </div>
        </div>
      );
    }
  }
}

export default withRouter(SelectedServicio)
