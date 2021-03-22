import React, {useState} from "react";
import * as ReactIf from "react-if";
import styled from "styled-components";
import * as Icons from "react-icons/bs"
import {Pagination} from "semantic-ui-react";
import * as PagerLayout from "./styles";

const Pager =({
                  count,
                  page,
                  pages,
                  loading,
                  label,
                  term,
                  onTermChange,
                  onSearch,
                  disableSearch,
                  onPageChange
              })=>{
    console.log("Pager received ",{count, page, pages})
    const cb=()=>{}
    const triggerSearch=(e)=>{
        if (e.key === 'Enter') {
            onSearch&&onSearch();
        }
    }
    return <PagerLayout.PagerLayout>
        <PagerLayout.PagerControl>
            <div style={{marginLeft:'1rem',fontSize:'x-small'}}>
                <b>Found {count||"no"} {label||"item"}(s)</b>
            </div>
            <div>
                <Pagination
                    size='mini'
                    firstItem={null}
                    lastItem={null}
                    secondary
                    disabled={loading}
                    onPageChange={onPageChange}
                    defaultActivePage={page} totalPages={pages} />
            </div>

        </PagerLayout.PagerControl>
        <ReactIf.If condition={!disableSearch}>
            <ReactIf.Then>
                <div className={`input`} onKeyDown={triggerSearch} value={term} onChange={onTermChange||cb}>
                    <PagerLayout.PagerInput />
                </div>
            </ReactIf.Then>
        </ReactIf.If>

    </PagerLayout.PagerLayout>
}


export default Pager;
