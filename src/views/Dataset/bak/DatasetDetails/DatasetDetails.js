import React ,{useState,useEffect} from "react";
import {Row, Col, Container, Spinner} from "react-bootstrap";
import styled from "styled-components";
import {Link,useLocation,useParams,useHistory} from "react-router-dom";
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import "draft-js/dist/Draft.css";
import {Editor, EditorState,RichUtils} from 'draft-js';
import useClient from "../../../api/client";
import getDataset from "../../../api/Dataset/getDataset";


const Label=styled.div`
  __border-left: 4px solid lightblue;
  margin-bottom: 2px;
  padding-left : 2px;
  

`
const Md=styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
width:100%;
`

const Edit=styled.div`
text-align: right;
padding-right: 14px;
`

const DatasetDetails=(props)=>{
    let client = useClient();
    let params=useParams();
    console.log("params = ", params);
    const mdParser = new MarkdownIt(/* Markdown-it options */);
    const [editorState, setEditorState]= useState(  EditorState.createEmpty());
    let [info, setInfo]=useState({});
    let [ready, setReady] = useState(false);
    useEffect(()=>{
        if (client){
            client
                .query(
                    getDataset(params.uri)
                )
                .then((res)=>{
                    console.log("res =", res);
                    if (!res.errors){
                        const dataset= res.data.getDataset;
                        setInfo(dataset);
                        setReady(true);
                    }
                })
                .catch((err)=>{
                    console.log("err = ", err);
                })
        }
    },[client]);

    if (!ready){
        return                        <Col>
            <Spinner variant={"primary"} animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </Col>
    }
    return <Md>
        <Container className={"m-0 p-0"}>
            <Row >
                <Col xs={8}>
                    <b className={"text-secondary"}>Cloud Map</b>
                </Col>
            </Row>
            <Row>

            <Col style={{}} xs={12}>
                <table>
                    <tr>
                        <td> <b>Account Id</b> </td>
                        <td><code>{info.AwsAccountId}</code></td>
                    </tr>
                    <tr>
                        <td> <b>Bucket Name</b></td>
                        <td><code>{info.S3BucketName}</code></td>
                    </tr>
                    <tr>
                        <td> <b>Database</b></td>
                        <td><code>{info.GlueDatabaseName}</code></td>
                    </tr>
                </table>

            </Col>
        </Row>

    </Container>
    </Md>
}


export default DatasetDetails;
