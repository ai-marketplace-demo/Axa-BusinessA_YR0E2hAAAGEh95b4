import { gql } from "apollo-boost";

const test= ()=>{
    return {
        query:gql`
            query Test{
                test
            }
        `
    }
}


export default test;
