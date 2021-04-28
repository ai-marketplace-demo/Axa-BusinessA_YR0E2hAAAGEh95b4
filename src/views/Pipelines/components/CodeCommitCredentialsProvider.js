import {useState,useEffect} from "react";
import useClient from "../../../api/client";
import getSqlPipelineCredsLinux from "../../../api/SqlPipeline/getSqlPipelineCredsLinux";
import {Button,Message} from "semantic-ui-react";
import * as ReactIf from "react-if";
const CodeCommitCredentialProvider= ({pipeline, client})=>{
    const [script, setScript] = useState(null);
    const [error, setError] = useState(null)
    const getScript = async ()=>{
        const response = await client.query(getSqlPipelineCredsLinux(pipeline.sqlPipelineUri));
        if (!response.errors){
            setScript(JSON.parse(response.data.getSqlPipelineCredsLinux));
        }else {
            setError(response.errors[0].message);
        }
    }
    return <div>
        <Message >
            <Message.Header>CodeCommit Repository</Message.Header>
            <Message.Content>
                <p>Generate script to interact with the pipeline repo by clicking the button below</p>
                <b>{pipeline.repo}</b> aws://{pipeline.environment.AwsAccountId}/{pipeline.environment.region}
            </Message.Content>
        </Message>
        <Button size={`mini`} primary onClick={getScript}>Get Credentials</Button>
        <ReactIf.If condition={script&&!error}>
            <ReactIf.Then>
                <div style={{
                    backgroundColor:'rgba(0,0,0,0.03)',
                    padding:'1rem',
                    marginTop:'1rem',
                    fontSize:'x-small'}}>
                {
                    Object.keys(script||{}).map((k)=>{
                        return <div>export {k}={script&&script[k]} </div>
                    })
                }
                <b style={{fontSize:'small'}}>
                    {`git clone codecommit::${pipeline.environment.region}:${'//'}${pipeline.repo}`}
                </b>
                </div>
            </ReactIf.Then>
            <ReactIf.Else>
                <ReactIf.If condition={error}>
                    <ReactIf.Then>
                        <Message negative>
                            {error}
                        </Message>
                    </ReactIf.Then>
                </ReactIf.If>
            </ReactIf.Else>
        </ReactIf.If>
    </div>

}


export default CodeCommitCredentialProvider;
