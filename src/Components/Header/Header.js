import React from "react";
import { Link } from 'react-router-dom';
import cookie from 'react-cookies'

// Modals
import Join from '../Modals/Join'
import Login from '../Modals/Login'
import Data from '../Modals/Data'

// Icons
import LogOut from './LogOut'

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = { tokenSitio: cookie.load('tokenSitio') }
  }

  async isLogged(tokenSitio) { // va a estar pendiente de un cambio de valor a la cookie
    await this.setState({ tokenSitio: cookie.load('tokenSitio') })
    this.props.isLogged('isLogged')
  }

  render() {
    if (!this.state.tokenSitio) { // si no hay cookie, muestra header para logearse
      return (
       <div className = "header">
         <Link to = { '/' }>
          <img className = "logo" src = { require('../Imgs/logo.png') } alt = ""/>
         </Link>
         <Join isLogged = {(tokenSitio) => this.isLogged(tokenSitio)} />
         <Login isLogged = {(tokenSitio) => this.isLogged(tokenSitio)} />
       </div>
    );
    }

    else {
      return (
       <div className = "header">
         <Link to = { '/' }>
          <img className = "logo" src = { require('../Imgs/logo.png') } alt = ""/>
         </Link>
         <Data isLogged = {(tokenSitio) => this.isLogged(tokenSitio)} />
         <LogOut isLogged = {(tokenSitio) => this.isLogged(tokenSitio)} />
       </div>
      );
    }
  }
}
