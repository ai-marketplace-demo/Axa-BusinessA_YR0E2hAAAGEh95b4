import {createGlobalStyle} from 'styled-components';
//import "bootstrap/dist/css/bootstrap.min.css";
import "@pathofdev/react-tag-input/build/index.css";
import 'semantic-ui-css/semantic.min.css'
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: 'Montserrat', sans-serif;
  }
  #root {
    height: 100%;
    width: 100%;
  }

  
 
  a {
    outline: none;
    color: black;
    outline-color: none;
    text-decoration: none;
  }
 
  
`;



export default GlobalStyle;
