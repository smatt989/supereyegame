import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { MOUSE, EYES, TOBII4C } from '../utilities.js'
import PositionChartContainer from './PositionChart.jsx';


class GameData extends React.Component {

  constructor(props) {
    super(props);

  }

  componentDidMount(props) {

  }


  render() {



    return <div id="game-data">
        <div className="col-md-6 chart-bucket">
            <PositionChartContainer cursorPosition={this.props.cursorPosition} dimension={"x"} />
        </div>
        <div className="col-md-6 chart-bucket">
            <PositionChartContainer cursorPosition={this.props.cursorPosition} dimension={"y"}/>
        </div>
    </div>
  }
};

const mapStateToProps = state => {
  return {
    cursorPosition: state.get('cursorPosition')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }
}

const GameDataContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameData)

export default GameDataContainer