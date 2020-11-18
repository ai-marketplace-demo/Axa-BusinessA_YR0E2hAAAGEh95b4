import React from "react";
import {Row,Col} from "react-bootstrap";



const Header = (props)=>{


    return <Row style={{width:'100%',zIndex:'999',top:0,position: 'sticky', marginLeft:'0'}} className={` p-0 m-0 bg-white `}>
        <Col style={{marginLeft:'0'}} className={`m-0`} xs={12}>
            <div

                style={{
                    display:'flex' ,
                    //boxShadow:'0px 2px 3px 0px rgba(0, 0, 255, .2)',
                    //borderRadius:'0px 0px 18px 18px'
                }} className={`border-bottom   text-black pt-2 pb-2 `}>
                <div style={{width:'5%'}}></div>
                <div style={{display:'grid',fontSize:'1.2rem',fontWeight:'bolder',width:'15%'}}className={``}>
                    <b>[d]atahub</b>
                    <i style={{fontSize:'0.77777777777rem'}}>simplified cloud analytics</i>
                </div>
                <div style={{width:'70%'}}></div>
                <div
                    onClick={()=>{props.setProfileMenuDisplayed(!props.profileMenuDisplayed)}}
                    className={`shadow text-white  text-center rounded-pill `}
                    style={{
                        paddingTop:'0.1rem',
                        backgroundColor:'teal',
                        fontFamily:'Roboto' ,
                        fontSize:'1.1rem',
                        width:`2rem`,
                        height:'2rem'
                    }}>
                    m
                </div>

            </div>
        </Col>
    </Row>
}


export default Header;
