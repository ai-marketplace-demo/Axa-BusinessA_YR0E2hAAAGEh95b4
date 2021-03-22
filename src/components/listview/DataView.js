import {If, Then, Else} from "react-if";
import Pager from "../pager/Pager";
import {useHistory} from "react-router";
// eslint-disable-next-line no-unused-vars
import {Button, Placeholder} from 'semantic-ui-react'
import PropTypes from 'prop-types'; // ES6
import {AssetCard,CardGrid} from "../card";
import {DataViewHeader,DataViewLayout} from "./styles";




const DataView = (props) => {
    let history = useHistory();
    const redirect = () => {
        history.push(props.createLink());
    }

    return <DataViewLayout>
        <DataViewHeader>
            {props.icon}
            <div style={{color:'dodgerblue',fontSize:'x-large'}}><b>{props.title} </b></div>
            <small style={{fontSize: 'x-small', color: 'rgba(0,0,0,0.7)'}}> | {props.breadcrumbs} </small>
            <div/>
            <div>
                <If condition={props.createLink&&props.creatable}>
                    <Then>
                        <Button color={`blue`} compact={true} basic onClick={redirect}>
                            {props&&props.createLabel||"Create"}
                        </Button>
                    </Then>
                </If>
                <If condition={props.action}>
                    <Then>
                        {props.action}
                    </Then>
                </If>
            </div>
        </DataViewHeader>
        <Pager
            {...props.pager}
        />
        <If condition={props.loading}>
            <Then>
                <CardGrid style={{marginTop: '1rem'}} className={`items`}>
                {
                    ["1","2","3",'4','5'].map(()=>{
                        return <div style={{boxShadow:'0 0 3px 4px rgba(0,0,0,0.03)',padding:'2em',borderRadius:'12px',height:'1.2fr',border:'1px solid lightgrey'}}>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Header>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line length={`full`}/>
                                    <Placeholder.Line length={`medium`}/>
                                    <Placeholder.Line length={`medium`}/>
                                    <Placeholder.Line length={`short`}/>
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </div>
                    })
                }
                </CardGrid>
            </Then>
            <Else>
                <CardGrid style={{marginTop: '1rem'}} className={`items`}>
                    {
                        props.items.nodes.map((node) => {
                            return <AssetCard
                                {...node}
                                link={props.linkComponent({item:node})}
                                uri={node[props.keyField]}
                                commentsLink={props.commentsLink}
                                commentable={props.commentable}
                                collectionable={props.collectionable}
                                keyField={props.keyField}
                            />
                        })
                    }
                </CardGrid>

            </Else>
        </If>


    </DataViewLayout>
}
DataView.propTypes = {
    createLink: PropTypes.func,
    icon: PropTypes.element,
    title: PropTypes.string,
    breadcrumbs: PropTypes.string,
    itemBody: PropTypes.elementType,
    items: PropTypes.array,
    label: PropTypes.string,
}
export default DataView;
