import React, {createContext, useState, Component, useEffect} from 'react';

const AuthContext = createContext({
    user: null,
    isAuthenticated: null,
    token : null
});




export {AuthContext};
