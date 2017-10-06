import React from 'react';
import { connect } from 'react-redux';
import { Map, List} from 'immutable';
import {
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import {HighchartsChart, Chart, Title, Subtitle, Legend, XAxis, YAxis, LineSeries} from 'react-jsx-highcharts';
import Highcharts from 'highcharts';

class PositionChart extends React.Component {

    constructor(props) {
      super(props);

      this.getCurrentPosition = this.getCurrentPosition.bind(this)
      this.thisId = this.thisId.bind(this)
    }

    thisId() {
        return this.props.dimension+"chart"
    }

    getCurrentPosition() {
        return this.props.cursorPosition
    }

    componentDidMount() {
            const id = this.thisId()
            const dimension = this.props.dimension

            var arrayLength = 30
            var xAxisArray = []
            var yAxisArray = []


            const getCurrentPosition = this.getCurrentPosition

            for(var i = 0; i < arrayLength; i++) {
              var y = 0
              var x = i
              xAxisArray[i] = x
              yAxisArray[i] = y
            }

            const rangeBuffer = 100

            var range;

            if(dimension == "x"){
                range = [0 - rangeBuffer, screen.width + rangeBuffer]
            } else {
                range = [0 - rangeBuffer, screen.height + rangeBuffer]
            }

            var layout = {
              yaxis: {range: range},
              showLegend: false,
              margin: { t: 0, l: 30, r: 0, b: 25 }
            };

            Plotly.plot(id, [{
              y: yAxisArray,
              x: xAxisArray,
              mode: 'lines',
              line: {color: '#80CAF6'}
            }], layout);

            var cnt = 0;

            var interval = setInterval(function() {
              const nextPosition = getCurrentPosition()
              if(nextPosition.get(dimension)){
                  var y = nextPosition.get(dimension)
                  var x = new Date().getTime()
                  console.log(x)
                  console.log(y)
                  yAxisArray = yAxisArray.concat(y)
                  yAxisArray.splice(0, 1)
                  xAxisArray = xAxisArray.concat(x)
                  xAxisArray.splice(0, 1)

                  var data_update = {
                    y: [yAxisArray],
                    x: [xAxisArray]
                  };

                  Plotly.update(id, data_update)
              }

              if(cnt === 100) clearInterval(interval);
            }, 100);
    }

    render() {




        return <div id={this.thisId()}>
        </div>
    }
};

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  }
}

const PositionChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PositionChart)

export default PositionChartContainer
