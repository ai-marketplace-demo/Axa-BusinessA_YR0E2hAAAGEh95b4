import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

const useGroups = () => {
    const [groups, setGroups] = useState(null);
    const fetchGroups = async () => {
        const user = await Auth.currentAuthenticatedUser();
        setGroups(user.signInUserSession.accessToken.payload['cognito:groups']);
    };


    useEffect(() => {
        if (!groups) {
            fetchGroups();
        }
    });
    return groups;
};

export default useGroups;
