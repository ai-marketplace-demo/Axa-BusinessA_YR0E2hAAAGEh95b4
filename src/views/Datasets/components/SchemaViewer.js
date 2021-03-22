import {useContext, useEffect, useRef, useState} from "react";
import * as ReactIf from "react-if"
import Xarrow from "react-xarrows";
import {Link } from "react-router-dom";
import styled from "styled-components";
import * as _ from "lodash";
import {SchemaStyles} from "./styles";
import {ThemeContext} from "../../../components/layout";
import {PagedResponseDefault} from "../../../components/defaults";
import getDatasetSchema from "../../../api/Dataset/getDatasetSchema";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
const TableColumn=({column})=>{
    return <div id={column.label}>
        <SchemaStyles.TableColumnStyled>
            <b>{column.label}</b>
            <i>{column.typeName}</i>
        </SchemaStyles.TableColumnStyled>
    </div>
}

const Table = ({table})=>{
    return <SchemaStyles.TableStyle nbcols={table.columns.nodes.length}>
        <SchemaStyles.TableHeaderStyle>
            <Link style={{color:'white'}} to={`/table/${table.tableUri}/`}>{table.GlueTableName}</Link>
        </SchemaStyles.TableHeaderStyle>
        {
            table.columns.nodes.map((column)=>{
               return <TableColumn column={column}/>
            })
        }
    </SchemaStyles.TableStyle>
}

const Label=({label})=>{
    return <div style={{margin:'2%',fontWeight:'lighter',fontSize:'small'}}>
        {label}
    </div>
}

const SchemaViewer= ({dataset, client})=>{
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    const context= useContext(ThemeContext);
    const [tables, setTables] = useState(PagedResponseDefault);

    const fetchItems = async()=>{
        const response = await client.query(getDatasetSchema({datasetUri:dataset.datasetUri}));
        if (!response.errors){
            setTables(response.data.getDataset.tables);
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client]);

    useEffect(()=>{},[context.showsidebar])

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return <div style={{width:'100%'}}>
        <SchemaStyles.SchemaLayout>
            {
                tables.nodes.map((table)=>{
                    return <Table table={table}/>
                })
            }
            {/**
            <Xarrow
                strokeWidth={`1.3`}
                path={`smooth`}
                lineColor={`black`}
                headColor={`black`}
                label={{end:(<Label label={`N:1`}/>),start:'1:N', style:{color:'red'}}}
                start={`PYGs84`} //can be react ref
                end={'jg7v3W'} //or an id
            />
            <Xarrow
                strokeWidth={`1.3`}
                path={`smooth`}
                lineColor={`blue`}
                label={{end:'N:1',start:'1:N'}}
                headColor={`blue`}
                start={`QWpkBO`} //can be react ref
                end={'NjIurr'} //or an id
            />
            **/}
        </SchemaStyles.SchemaLayout>
    </div>
}
export default SchemaViewer;
