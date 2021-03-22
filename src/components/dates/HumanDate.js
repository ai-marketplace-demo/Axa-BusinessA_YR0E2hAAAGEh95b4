import React from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const HumanDate=({d})=>{
    return <div style={{fontSize:'xx-small'}}>{dayjs(d).fromNow()}</div>
}
HumanDate.propTypes={
    d: PropTypes.string
}

export default HumanDate;
