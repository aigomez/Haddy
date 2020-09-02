import * as serviceWorker from './serviceWorker';
import React from "react";
import ReactDOM from 'react-dom';
import ReactPlaceholder from 'react-placeholder';
import { BrowserRouter, Route } from "react-router-dom";
import { AnimatedSwitch  } from 'react-router-transition';
import { ServiciosUrl } from './Components/ApiUrls'
import cookie from 'react-cookies'

import Header from './Components/Header/Header';
import MainPH from './Components/PlaceHolders/MainPH'
import Main from './Components/Main/Main';

import Items from './Components/Main/Items';
import SelectedItem from './Components/Main/SelectedItem';
import Servicios from './Components/Main/Servicios';
import SelectedServicio from './Components/Main/SelectedServicio';
import Envio from './Components/Main/Envio';
import HistorialPagos from './Components/Main/HistorialPagos';
import RecuperarPassword from './Components/Main/RecuperarPassword';

import Footer from './Components/Footer/Footer';

import './Components/Styles/Globals.css';
import './Components/Styles/Header.css';
import './Components/Styles/Main.css';
import './Components/Styles/Modals.css';
import './Components/Styles/SelectedItem.css';
import './Components/Styles/SelectedServicio.css';
import './Components/Styles/Footer.css';

class Index extends React.Component {
  constructor() {
    super();
    this.state = { dataSource: [], tokenSitio: cookie.load('tokenSitio') || '' };
  }

  componentDidMount() {
    fetch(`${ServiciosUrl}`)
      .then(res => res.json())
      .then(json => { this.setState({ dataSource: json, readyServicios: true }) })
      .catch((error) => console.log(error));
  }

  isLogged(tokenSitio) { this.setState({ tokenSitio: cookie.load('tokenSitio') }) }

  render() {
    return (
      <BrowserRouter>
        <Route path = "/">
          <Header isLogged = {(tokenSitio) => this.isLogged(tokenSitio)} />

          <ReactPlaceholder ready = {this.state.readyServicios} customPlaceholder = { <MainPH /> }>
            <Main dataSource = { this.state.dataSource }/>
          </ReactPlaceholder>
        </Route>

        <AnimatedSwitch
          atEnter={{ opacity: 0, foo: 0 }}
          atLeave={{ opacity: 0, foo: 2 }}
          atActive={{ opacity: 1, foo: 1 }}
          mapStyles={(styles) => {
            return {
                position: (styles.foo <= 1) ? 'relative': 'absolute',
                width: '100%',
                height: '100%',
                opacity: styles.opacity
            }
          }}
        >
          <Route path = "/" exact component = { Servicios } />
          <Route path = "/historial/" exact component = { HistorialPagos } />
          <Route path = "/productos" exact component = { Items } />
          <Route path = "/envio/" exact component = { Envio } />
          <Route path = "/recuperarPassword/" exact component = { RecuperarPassword } />

          <Route path = "/producto/:id/" exact>
            <SelectedItem tokenSitio = { this.state.tokenSitio || '' } />
          </Route>

          <Route path = "/servicio/:_id/" exact>
            <SelectedServicio tokenSitio = { this.state.tokenSitio || '' } />
          </Route>
        </AnimatedSwitch>

        <Route path = "/" component = { Footer } />
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
serviceWorker.register();
