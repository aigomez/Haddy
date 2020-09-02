import React from "react";
import { Link } from 'react-router-dom';
import { Spinner } from 'react-activity';
import 'react-activity/dist/react-activity.css';
import { ItemsUrl } from '../ApiUrls'

export default class Items extends React.Component {
  constructor() {
    super();
    this.state = { dataSource: [], isLoading: true };
  }

  async componentDidMount() {
    await fetch(`${ItemsUrl}`)
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
        <div className = "items flex m-top">
          {
           this.state.dataSource.map(item =>
              <div key = {item.id} className = "div-initial">

               <Link to = { `/producto/${item.id}/` }>
                  <img src = {item.enlaceImagen} className = "thumbnail" draggable = "false" alt = "" />
               </Link>

                <p>{ item.nombreProducto }</p>
                <p className = "puntos"><label className = "fas fa-star" /> { item.puntos }</p>
              </div>
           )
          }
        </div>
      );
    }
  }
}
