import {useState, useEffect} from "react";
import * as MetricComponents from "../Metric"
import useClient from "../../api/client";
import * as AiIcons from "react-icons/ai";
import styled from "styled-components";

const Header= styled.div`
  display: grid;
  //background: linear-gradient(to bottom,rgba(0,0,0,0.01),white);
  padding: 1rem;
  grid-template-columns: auto auto auto  1fr auto 0.1fr;
  grid-column-gap: 3px;
  place-items: center start ;
`
const HomePage=()=>{
    const client = useClient();

    return    <div style={{marginTop:'',padding:'1rem',display:'block'}}>
        <Header>
            <AiIcons.AiOutlineCompass/>
            <div style={{color:'dodgerblue',fontSize:'x-large'}}><b>Home </b></div>
            <small style={{fontSize: 'x-small', color: 'rgba(0,0,0,0.7)'}}> | {`/home`} </small>
        </Header>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr ', columnGap:'2rem', rowGap:'1rem'}}>
            <MetricComponents.MetricViewer
                client={client}
                title={`Data Volumes`}
                filter={{
                    metricName:'dataset:size',
                    aggregation: {
                        GroupBy :['created'],
                        AggregationType: "sum"
                    }
                }}
            />

            <MetricComponents.MetricViewer
                client={client}
                title={`Records Processed`}
                filter={{
                    metricName:'pipeline:records',
                    aggregation: {
                        GroupBy :['created'],
                        AggregationType: "sum"
                    }
                }}
            />
            <MetricComponents.MetricViewer
                client={client}
                title={`Queries Run`}
                filter={{
                    metricName:'worksheet:run',
                    aggregation: {
                        GroupBy :['created'],
                        AggregationType: "sum"
                    }
                }}
            />
            <MetricComponents.MetricViewer
                client={client}
                title={`Nb of tables`}
                filter={{
                    metricName:'dataset:table',
                    aggregation: {
                        GroupBy :['created'],
                        AggregationType: "sum"
                    }
                }}
            />
        </div>
    </div>

}


export default HomePage;
