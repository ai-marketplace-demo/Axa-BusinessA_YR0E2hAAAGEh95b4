/**import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './style.css';

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
                name: '# Occurences',
                data: this.props.metadata.Histogram.map((r) => [r.name, parseFloat(r.nbtimes)]),
            }],
        };
        return (
            <div className="content-analysis-container">
                <div>
                    <div className="metrics-title">
                        <span>Content analysis</span>
                    </div>
                    <div className="metrics-container">
                        <div className="metrics-date-container">
                            <div>
                                <span className="metrics-prop">Minimum</span>
                                <span>{ this.props.metadata.Minimum }</span>
                            </div>
                            <div>
                                <span className="metrics-prop">Maximum</span>
                                <span>{ this.props.metadata.Maximum}</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div>
                    <div className="metrics-graph-container">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


export default DateTypeMetrics;
**/
