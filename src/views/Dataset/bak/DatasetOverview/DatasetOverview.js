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
`

const Edit=styled.div`
text-align: right;
padding-right: 14px;
`

const DatasetOverview=(props)=>{
    console.log("DatasetOverview    DatasetOverview DatasetOverview DatasetOverview")
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
    return <Container className={"m-0 p-0"}>
        <Row>
            <Col xs={11}>
                <Md>
                    <Row>
                        <Col xs={8}>
                            <b className={"text-secondary"}>Name</b>
                        </Col>
                        <Col xs={4}>
                            <Edit>Edit</Edit>
                        </Col>
                    </Row>
                    <Row className={"mt-1"}>
                        <Col xs={8}>
                            <h5><b>{info.label}</b></h5>
                        </Col>
                    </Row>

                    <Row className={"mt-2"}>
                        <Col xs={8}>
                            <b className={"text-secondary"}>Description</b>
                        </Col>
                        <Col xs={4}>
                            <Edit>Edit</Edit>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8}>
                            {info.description}
                        </Col>
                    </Row>

                    <Row className={"mt-4"}>
                        <Col xs={8}>
                            <b className={"text-secondary"}>Summary</b>
                        </Col>
                        <Col xs={4}>
                            <Edit>Edit</Edit>
                        </Col>
                    </Row>
                    <Row >
                        <Col style={{height: "35vh", textAlign:"justify"}} className={"p-5"} xs={12}>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </Col>
                    </Row>
                    <Row >
                        <Col xs={8}>
                            <b className={"text-secondary"}>Cloud Map</b>
                        </Col>

                        <Col style={{}} xs={12}>
                            <table>
                                <tr>
                                    <td> <b>Account Id</b> </td>
                                    <td><code>123456789012</code></td>
                                </tr>
                                <tr>
                                    <td> <b>Bucket Name</b></td>
                                    <td><code>roche-mydataset-12345</code></td>
                                </tr>
                                <tr>
                                    <td> <b>Database</b></td>
                                    <td><code>roche-mydataset-db</code></td>
                                </tr>
                            </table>

                        </Col>
                    </Row>

                </Md>
            </Col>
        </Row>

    </Container>
}


export default DatasetOverview;
