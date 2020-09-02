import React from "react";
import { Slide } from 'react-slideshow-image';
import { Link } from 'react-router-dom';

export default class Banner extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const properties = {
      autoplay: false,
      duration: 1000,
      transitionDuration: 300,
      indicators: false,
    }

    return (
     <Slide {...properties}>
       {
        this.props.dataSource.map((servicio, index) =>
          <div key = {index}>
            <Link to = { `/servicio/${servicio.id}/` }>
              <img src = {servicio.enlaceImagen} className = "banner" draggable = "false" alt = "" />
            </Link>
          </div>
        )
      }
      </Slide>
   );
  }
}
