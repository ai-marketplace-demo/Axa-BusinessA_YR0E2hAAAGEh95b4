import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

const useToken = () => {
    const [token, setToken] = useState(null);
    const fetchAuthToken = async () => {
        const session = await Auth.currentSession();
        const t = await session.getIdToken().getJwtToken();
        setToken(t);
    };


    useEffect(() => {
        if (!token) {
            fetchAuthToken();
        }
    });
    return token;
};

export default useToken;
