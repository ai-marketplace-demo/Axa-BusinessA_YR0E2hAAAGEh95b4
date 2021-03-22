import React from "react";
import PropTypes from "prop-types";
import * as Styles from "./styles"

const DropdownMenuItem=({onClick,close,eventKey,...props})=>{
    const handleClick=()=>{
        if (onClick){
            onClick(eventKey)
        }
        close&&close();
    }
    return <Styles.DropdownItem
        onClick={handleClick}
    >
        {
            React.Children.only(props.children)
        }
    </Styles.DropdownItem>
}

DropdownMenuItem.propTypes = {
    __TYPE: PropTypes.string,
};
DropdownMenuItem.defaultProps={
    __TYPE:'DropdownMenuItem'
}



export default DropdownMenuItem;
