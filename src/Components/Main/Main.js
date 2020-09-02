import React from "react";
import Banner from './Banner'
import { NavLink } from 'react-router-dom';

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <span>
        <Banner dataSource = { this.props.dataSource } />
        <div className = "btns m-top">
          <NavLink to = '/' activeClassName = "linkActivo" exact>
            <i className = "fas fa-chart-pie" />
          </NavLink>

          <NavLink to = '/historial' activeClassName = "linkActivo" exact>
            <i className = "fas fa-book" />
          </NavLink>

          <NavLink to = '/productos' activeClassName = "linkActivo" exact>
            <i className = "fas fa-box-open" />
          </NavLink>
         </div>
      </span>
    );
  }
}
