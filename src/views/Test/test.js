import React, { useState, useEffect } from 'react';
import useClient from '../../api/client';
import testQuery from '../../api/Test/test';


const Test = () => {
    console.log('entering Test ');
    const client = useClient();
    const [response, setResponse] = useState('EMPTY');

    const testme = async () => {
        const r = await client.query(testQuery());
        console.log(r);
        if (!r.errors) {
            setResponse(r.data.test);
        } else {
            setResponse(r.errors[0].message);
        }
    };
    useEffect(() => {
        console.log('test/useEffect');
        if (client) {
            console.log('this is the client you always waited for !');
            testme();
        }
    }, [client]);
    return (
        <div>
            <h1>Test</h1>
            <p>{response}</p>
        </div>
    );
};


export default Test;
