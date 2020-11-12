import React  ,{useState} from "react";
import {If,Then,Else} from "react-if";
import {Container,Row,Col} from "react-bootstrap";
import * as Icon  from "react-bootstrap-icons";
import styled from "styled-components";
import ColoredCircle from "../ColoredCircle/ColoredCircle";
import TagPill from "../TagPill/TagPill";

const SectionStyled=styled.div`
margin-top: 1ch;
&:sshover{
  box-shadow: 10px 5px 5px lightgrey;
}
`



const FormSection  = (props)=>{
    const [isDisplayed, setIsDisplayed] = useState(props.open||false);
    return <SectionStyled>
        <If condition={isDisplayed}>
            <Then>
                <div className={`p-4 rounded bg-white border`}>
                    <Row>
                        <Col xs={8}><p className={`text-dark text-capitalize`}><b>{props.section}</b></p></Col>
                        <Col className={`text-right`} xs={4}>
                            <div onClick={()=>{setIsDisplayed(false)}} className={``}><Icon.ChevronUp size={16}/></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            {props.content||""}
                        </Col>
                    </Row>
                </div>
            </Then>
            <Else>
                <div className={`p-4 rounded bg-white border `}>
                    <Row>
                        <Col xs={8}><p className={`text-dark text-capitalize`}><b>{props.section}</b></p></Col>
                        <Col className={`text-right`} xs={4}>
                            <div onClick={()=>{setIsDisplayed(true)}}  className={``}><Icon.ChevronDown size={16}/></div>
                        </Col>
                    </Row>
                </div>
            </Else>
        </If>
    </SectionStyled>
}



export default FormSection  ;
