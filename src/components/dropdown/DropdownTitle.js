import React from "react";
import PropTypes from "prop-types";

const DropdownTile=(props)=>{
    return React.Children.only(props.children)
}

DropdownTile.propTypes = {
    __TYPE: PropTypes.string,
};
DropdownTile.defaultProps={
    __TYPE:'DropdownTile'
}

export default DropdownTile;
