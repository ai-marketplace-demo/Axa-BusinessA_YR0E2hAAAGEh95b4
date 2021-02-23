import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


const HumandReadableDate = (props) => <React.Fragment>{dayjs(props.d).fromNow()}</React.Fragment>;


export default HumandReadableDate;
