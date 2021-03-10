import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CompletenessMetrics from './CompletenessMetrics';
import StringTypeMetrics from './StringTypeMetrics';
import DateTypeMetrics from './DateTypeMetrics';
import DisplayMetadataNumber from './NumberTypeMetrics';
import './style.css';


class MetricsComponent extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    /*renderGraph(column) {
        if (column.Type === 'string') {
            return (
                <StringTypeMetrics
                    metadata={column.Metadata}
                />
            );
        }

        if (column.Type === 'date') {
            return (
                <DateTypeMetrics
                    metadata={column.Metadata}
                />
            );
        }

        if (column.Type === 'bigint' || column.Type === 'double' || column.Type === 'float') {
            return (
                <DisplayMetadataNumber
                    metadata={column.Metadata}
                />
            );
        }

        return false;
    }

    renderCompleteness(column) {
        if (column.Metadata) {
            return (
                <CompletenessMetrics
                    completeness={column.Metadata.Completeness}
                />
            );
        }

        return false;
    }
}*/
    render() {
        const {
            column
        } = this.props;

        return (
            <React.Fragment>
                <Row className="mt-2">
                    <h5>{column.Name}</h5>
                    <code>{column.Type}</code>
                </Row>
                <Row className="values mt-2">
                    Not available !
                </Row>
            </React.Fragment>
        );
    }

}

export default (MetricsComponent);

