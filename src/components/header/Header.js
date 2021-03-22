import styled from "styled-components";
import {If, Then,Else} from "react-if";
import {Dropdown} from "semantic-ui-react";
import React from "react";
import {HeaderLayout,Circle} from "./styles";


const Header=({fullscreen})=>{


    return <If condition={!fullscreen}>
        <Then>
            <HeaderLayout>
                <div/>
                <Circle>m</Circle>
                <div/>
            </HeaderLayout>
        </Then>

    </If>
}


export default Header;
