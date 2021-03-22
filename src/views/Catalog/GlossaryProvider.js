import React, {createContext,useState,useEffect,useContext} from "react";


const GlossaryContext = React.createContext({
    nodes:[],
    tree:[],
    getNode:async ()=>{},
})

export default GlossaryContext;
