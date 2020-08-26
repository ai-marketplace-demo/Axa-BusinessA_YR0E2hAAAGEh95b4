import React ,{useState} from "react";
import {Row, Col, Container, Spinner} from "react-bootstrap";
import styled from "styled-components";


const QueryListPanelStyled= styled.div`
margin-top: 1%;
__border-right: black 1px solid;
min-height : 35vh;
background-color: white; 

`


const QueryFileItem=styled.div`
font-size: 1.2rem;
padding-left: 2rem;
font-weight: bolder;
font-family: "Open Sans" ,sans-serif;
&:hover{
  background-color: honeydew;
  padding-left: 2rem;
}
`

const QueryFile= (props)=>{
    return <QueryFileItem><Row><Col xs={12}>
        <h6>{props.fileName}</h6>
    </Col></Row>
    </QueryFileItem>





}
const QueryListPanel = (props)=>{
    let [queries, setQueries] = useState([]);
    let [ready, setReady] = useState(false);
    setTimeout(()=>{
        console.log("setting queries");
        setQueries([
            "query1.sql",
            "query2.sql",
            "query3.sql"
        ]);
        setReady(true);
    },2000)
    return <QueryListPanelStyled>

        { !ready?(
           <Spinner size={"sm"} animation={"border"} variant={"primary"}/>
        ):(
            queries.map((fileName)=>{
            return <QueryFile fileName={fileName}></QueryFile>
        })

            )
        }
        </QueryListPanelStyled>
}




export default QueryListPanel;
