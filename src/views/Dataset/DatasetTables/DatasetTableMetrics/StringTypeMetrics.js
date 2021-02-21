import React from 'react';
import './style.css';
import {Col, Row} from "react-bootstrap";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";


class StringTypeMetrics extends React.PureComponent {

    render() {
        if (!this.props.metadata) {
            return false;
        }
        const options = {
            chart: { type: 'pie', height: 200, width: 400},
            title: { text: '' },
            xAxis: {
                categories: this.props.metadata.Histogram.map((r) => r.name),
            },
            series: [{
                name: '% Occurrences',
                data: this.props.metadata.Histogram.map((r) => [r.name, parseFloat(r.prct)]),
            }],
        };
        return (
            <Row>
                <Col xs={4}>
                    <div className="metrics-title">
                        <span>Content analysis</span>
                    </div>
                    <div className="metrics-string-container">
                        <div>
                            <span className="metrics-prop">Unique</span>
                            <span className="metrics-prop">{ parseInt(this.props.metadata.Unique, 10) }</span>
                        </div>
                        {
                            this.props.metadata.MostCommon && (
                                <div>
                                    <span className="metrics-prop">Most common</span>
                                    <span className="metrics-prop">{this.props.metadata.MostCommon.name}</span>
                                </div>
                            )
                        }
                    </div>
                </Col>
                <Col xs={8}>
                    <div className="metrics-graph-container">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                        />
                    </div>
                </Col>
            </Row>
        );
    }
}


export default StringTypeMetrics;
