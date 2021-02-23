import React, { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { If, Then, Else } from 'react-if';

const NotSharedItem = (props) => {
    const [enabled, setEnabled] = useState(true);
    const { item } = props;
    return (
        <tr>
            <td>{item.itemName}</td>
            <td>{item.itemType}</td>
            <td>
                <If condition={enabled}>
                    <Then>
                        <div onClick={() => { setEnabled(false); props.add(item); }} style={{ width: '4rem' }} className={'btn btn-sm btn-success rounded-pill'}>
                            Add
                        </div>
                    </Then>
                    <Else>
                        <div disabled={'true'} style={{ width: '4rem' }} className={'btn btn-sm btn-success  rounded-pill'}>
                            Add
                        </div>
                    </Else>
                </If>


            </td>
        </tr>
    );
};


export default NotSharedItem;
