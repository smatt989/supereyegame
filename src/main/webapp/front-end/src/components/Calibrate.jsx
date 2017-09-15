import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { doneCalibrating } from '../actions.js';
import { MOUSE, EYES } from '../utilities.js'


class Calibrate extends React.Component {

  constructor(props) {
    super(props);

    this.setupCalibration = this.setupCalibration.bind(this)
    this.markFaceSeen = this.markFaceSeen.bind(this)
    this.calibration1Done = this.calibration1Done.bind(this)
    this.calibration2Done = this.calibration2Done.bind(this)
    this.calibration3Done = this.calibration3Done.bind(this)
    this.calibration4Done = this.calibration4Done.bind(this)

    this.state = {seeFace: false, calibration1: false, calibration2: false, calibration3: false, calibration4: false}
  }

  videoHeight() {
    return 240;
  }

  videoTopBuffer() {
    return 50;
  }

  markFaceSeen() {
    this.setState({seeFace: true})
  }

  calibration1Done() {
    this.setState({calibration1: true})
  }

  calibration2Done() {
    this.setState({calibration2: true})
  }

  calibration3Done() {
    this.setState({calibration3: true})
  }

  calibration4Done() {
    this.setState({calibration4: true})
  }

  setupCalibration() {

      var video = document.getElementById("webgazerVideoFeed");
      if(video){
          video.style.visibility = "visible";
      }

      var overlay = document.getElementById("overlay");
      if(overlay){
        overlay.style.visibility = "visible";
      }

       const containerWidth = this.calibrationContainer.offsetWidth

       var width = 320;
       var height = this.videoHeight();
       var topDist = ((this.calibrationContainer.offsetTop) + this.videoTopBuffer())+'px';
       var leftDist = ((containerWidth - width) / 2) +'px';

       var video = document.getElementById('webgazerVideoFeed');
       video.style.display = 'block';
       video.style.position = 'absolute';
       video.style.top = topDist;
       video.style.left = leftDist;
       video.width = width;
       video.height = height;
       video.style.margin = '0px';

       webgazer.params.imgWidth = width;
       webgazer.params.imgHeight = height;

       var overlay = document.createElement('canvas');
       overlay.id = 'overlay';
       overlay.style.position = 'absolute';
       overlay.width = width;
       overlay.height = height;
       overlay.style.top = topDist;
       overlay.style.left = leftDist;
       overlay.style.margin = '0px';

       document.body.appendChild(overlay);

       var cl = webgazer.getTracker().clm;

       function drawLoop() {
           requestAnimFrame(drawLoop);
           overlay.getContext('2d').clearRect(0,0,width,height);
           if (cl.getCurrentPosition()) {
               cl.draw(overlay);
           }
       }
       drawLoop();
    }

  componentDidMount() {
    if(webgazer.isReady()){
        webgazer.resume()
    } else {
        webgazer.begin()//.showPredictionPoints(true)
    }

    const setupCalibration = this.setupCalibration

    function checkIfReady() {
        if (webgazer.isReady()) {
            setupCalibration();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }

    setTimeout(checkIfReady,100);
  }

  componentDidUpdate() {
    if(this.state.calibration1 && this.state.calibration2 && this.state.calibration3 && this.state.calibration4){
        this.props.doneCalibrating()

    }
  }

  render() {

    const controlStyle = {
        marginTop: this.videoHeight() + this.videoTopBuffer() + 20
    }



    var calibration1Style = {display: this.state.calibration1 ? 'none' : this.state.seeFace ? 'inline' : 'none'}
    var calibration2Style = {display: this.state.calibration2 ? 'none' : this.state.seeFace ? 'inline' : 'none'}
    var calibration3Style = {display: this.state.calibration3 ? 'none' : this.state.seeFace ? 'inline' : 'none'}
    var calibration4Style = {display: this.state.calibration4 ? 'none' : this.state.seeFace ? 'inline' : 'none'}

    var button = ""
    if(!this.state.seeFace) {
        button = <Button style={controlStyle} onClick={this.markFaceSeen}>I see my face</Button>
    }

    var calibrationInstructions = ""
    if(this.state.seeFace) {
        calibrationInstructions = <p style={controlStyle}>Click on each of the blue dots, closely tracking the mouse with your gaze.</p>
    }

    return (
        <div ref={calibrationContainer => {this.calibrationContainer = calibrationContainer}} className="text-xs-center">
                {button}
                {calibrationInstructions}
            <div onClick={this.calibration1Done} id="calibration1" className="calibration-target" style={calibration1Style}></div>
            <div onClick={this.calibration2Done} id="calibration2" className="calibration-target" style={calibration2Style}></div>
            <div onClick={this.calibration3Done} id="calibration3" className="calibration-target" style={calibration3Style}></div>
            <div onClick={this.calibration4Done} id="calibration4" className="calibration-target" style={calibration4Style}></div>
        </div>
    )
  }
};

const mapStateToProps = state => {
  return {
    game: state.get('game'),
    gameInput: state.get('gameInput')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    startGame: () => {
        return dispatch(startGame())
    },
    setGameInput: (input) => {
        return dispatch(setGameInput(input))
    },
    doneCalibrating: () => {
        return dispatch(doneCalibrating())
    }
  }
}

const CalibrateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Calibrate)

export default CalibrateContainer