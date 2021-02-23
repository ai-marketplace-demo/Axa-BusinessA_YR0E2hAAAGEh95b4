import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './style.css';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';


class DateTypeMetrics extends React.PureComponent {
    render() {
        if (!this.props.metadata) {
            return false;
        }
        const options = {
            chart: { type: 'column', height: 200, width: 400 },
            title: { text: '' },
            xAxis: {
                categories: this.props.metadata.Histogram.map((r) => r.name),
            },
            series: [{
                name: '# Occurrences',
                data: this.props.metadata.Histogram.map((r) => [r.name, parseFloat(r.nbtimes)]),
            }],
        };

        return (
            <Row>
                <Col xs={4}>
                    <div className="metrics-title">
                        <span>Content analysis</span>
                    </div>
                    <div className="metrics-container">
                        <div className="metrics-number-container">
                            <div>
                                <span className="metrics-prop">Mean</span>
                                <span className="metrics-prop">{ (Math.round(this.props.metadata.Mean * 100) / 100) }</span>
                            </div>
                            <div>
                                <span className="metrics-prop">Std Deviation</span>
                                <span className="metrics-prop">{ (Math.round(this.props.metadata.StdDeviation * 100) / 100) }</span>
                            </div>
                            <div>
                                <span className="metrics-prop">Minimum</span>
                                <span className="metrics-prop">{ (Math.round(this.props.metadata.Minimum * 100) / 100) }</span>
                            </div>
                            <div>
                                <span className="metrics-prop">Maximum</span>
                                <span className="metrics-prop">{ (Math.round(this.props.metadata.Maximum * 100) / 100) }</span>
                            </div>
                        </div>
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


export default DateTypeMetrics;
