import React, {useState} from "react";
import Select from "react-select";

const SupportedRegions=[
    { label:'Asia Pacific (Singapore)', value:'ap-southeast-1'},
    { label:'Asia Pacific (Tokyo)', value:'ap-northeast-1'},
    { label:'Asia Pacific (Sydney)', value:'ap-southeast-2'},
    { label:'Asia Pacific (Seoul)', value:'ap-northeast-2'},
    { label:'Asia Pacific (Mumbai)', value:'ap-south-1'},
    { label:'US East (N. Virginia)', value:'us-east-1'},
    { label:'US East (Ohio)', value:'us-east-2'},
    { label:'US West (Oregon)', value:'us-west-2'},
    { label:'US West (N. California)', value:'us-west-1'},
    { label:'Canada (Central)', value:'ca-central-1'},
    { label:'Europe (Frankfurt)', value:'eu-central-1'},
    { label:'Europe (Ireland)', value:'eu-west-1'},
    { label:'Europe (London)', value:'eu-west-2'},
];

const getRegionLabel=(value)=>{
    console.log(SupportedRegions,"<== getRegionLabel", value)
    console.log(SupportedRegions.find)
    return SupportedRegions.find((r)=>{return r.value==value}).label
}

const getRegionValue=(label)=>{
    return SupportedRegions.find((r)=>{return r.label==label}).label
}

const AwsRegionsSelect = (props)=>{

    const identity = ()=>{}


    return <Select
        value={props.region}
        onChange={props.selectRegion||identity}
        options={SupportedRegions}/>
}


export {AwsRegionsSelect,SupportedRegions,getRegionLabel,getRegionValue};
