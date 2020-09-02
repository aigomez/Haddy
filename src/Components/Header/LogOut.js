import React from "react";
import cookie from 'react-cookies'
import Swal from 'sweetalert2'

export default class LogOut extends React.Component {
  constructor() {
    super();
    this.state =  {}
  }

  onLogout() {
    cookie.remove('tokenSitio', { path: '/' })
    this.props.isLogged('')

    Swal.fire({
      icon: 'success', title: 'Te deslogeaste satisfactoriamente', showConfirmButton: false,
      timer: 2000, timerProgressBar: true, toast: true, position: 'top'
    })
  }

  render() {
    return (
       <div className = "icons">
          <i className = "fas fa-sign-out-alt" onClick = {() => this.onLogout()}/>
       </div>
   );
 }
}
