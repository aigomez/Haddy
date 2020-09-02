import React from "react";
import { Digital } from "react-activity"
import 'react-activity/dist/react-activity.css';

export default class MainPH extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
      return (
        <div>
          <img className = "banner" src = { require('../Imgs/LoadingBanner.jpg') } alt = "" />

          <div className = "loading-sprite">
            <Digital color = 'white' size = {20} />
          </div>

          <div className = "sticky bar-ph"></div>
        </div>
      )
  }
}
