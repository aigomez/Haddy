import React from "react";
import { Link } from 'react-router-dom';
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import { ServiciosUrl } from '../ApiUrls'

export default class Servicios extends React.Component {
  constructor() {
    super();
    this.state = { dataSource: [], isLoading: true };
  }

  async componentDidMount() {
    await fetch(`${ServiciosUrl}`)
      .then(res => res.json())
      .then(res => this.setState({ dataSource: res, isLoading: false }))
      .catch((error) => console.log(error));
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
        <div className = "servicios flex m-top">
          {
           this.state.dataSource.map(servicio =>
              <div key = {servicio.id} className = "div-servicio">

               <Link to = { `/servicio/${servicio.id}/` }>
                  <img src = {servicio.enlaceImagen} className = "thumbnail-servicio img-servicio" draggable = "false" alt = "" />
               </Link>

                <p>{ servicio.nombreServicio }</p>
              </div>
           )
          }
        </div>
      );
    }
  }
}
