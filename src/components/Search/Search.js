import React, { useState } from 'react';
import SearchStyled from './SearchStyled';

const Search = (props) => {
    const [term, setTerm] = useState('');
    const handleChange = (event) => {
        setTerm(event.target.value);
        if (!event.target.value.length) {
            props.reset && props.reset();
        }
        props.onChange && props.onChange(event.target.value);
    };
    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            props.submit && props.submit(term);
        }
    };
    return (
        <SearchStyled
            onKeyDown={handleEnter}
            value={term}
            placeholder={props.placeholder}
            onChange={handleChange}
        />
    );
};


export default Search;
