import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './style.css';

class CompletenessMetrics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        if (!this.props.completeness) {
            return false;
        }

        return (
            <Row>
                <Row>
                    <div className="metrics-title">
                        <span>Completeness</span>
                    </div>
                </Row>
                <Row className="completeness-valid">
                    <Col xs={6}><span>Valid</span></Col>
                    <Col xs={6}><span>{(this.props.completeness.prct_valid ? Math.round(this.props.completeness.prct_valid) : '0')} %</span></Col>
                </Row>
                <Row className="completeness-missing">
                    <Col xs={6}><span>Missing</span></Col>
                    <Col xs={6}><span>{(this.props.completeness.prct_missing ? Math.round(this.props.completeness.prct_missing) : '0')} %</span></Col>
                </Row>
            </Row>
        );
    }
}


export default CompletenessMetrics;
