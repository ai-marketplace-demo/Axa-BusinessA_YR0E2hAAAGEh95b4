import React ,{useState, useEffect, useContext} from "react";
import {BrowserRouter as Router,Link, Route, useParams, useLocation} from "react-router-dom";
import { createGlobalStyle } from 'styled-components';
import Layout from "./components/Layout/Layout";
import useAuth from "./hooks/useAuth";
require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/js/bootstrap.min");


const GlobalStyles = createGlobalStyle`
  body::-webkit-scrollbar {
    width: 0.2rem;
  }
  body::-webkit-scrollbar-track {
    background: red;
  }
  body::-webkit-scrollbar-thumb {
    background: blue;

  }
`;



const App=(props)=> {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const auth= useAuth();
    useEffect(()=>{
        if (auth){
            setAuthenticated(true)
        }
        },[auth]);

    if (!isAuthenticated){
        return <div></div>
    }
    return <div>
        <GlobalStyles/>
        <Router>
            <Layout/>
        </Router>
    </div>

};





export default  App ;
