import React, {useState,useEffect} from "react";
import useToken from "../../api/token";
import * as Layouts from "./styles";
import {Search, Input, Loader} from "semantic-ui-react";
import * as HiICons from "react-icons/hi";
import config from "../../config";
import Hit from "./Hit";
import {
    ReactiveBase,
    ReactiveList,
    SelectedFilters,
    MultiList,
    CategorySearch,
    DataSearch
} from "@appbaseio/reactivesearch";
import GlossarySearchComponent from "./GlossarySearchComponent";

const Catalog = ()=>{
    const token = useToken();
    const transformRequest = (request) => {
        console.log('inputRequest');
        console.log(request);
        const transformedRequest = { ...request };
        console.log('here ');
        transformedRequest.url = config.apiGateway.ESURL;


        console.log('transformedRequest');
        console.log(transformedRequest);

        return {
            ...request,
            url: transformedRequest.url,
            credentials: { token },
            headers: {
                AccessControlAllowOrigin: '*',
                AccessControlAllowHeaders: '*',
                'access-control-allow-origin': '*',
                Authorization: token,
                AccessKeyId: 'None',
                SecretKey: 'None',
                // username: 'moshirm@amazon.fr', //this is for local development only
            }
        };
    };
    if (!token) {
        return <Loader active={true}>
            <i>{`Loading Catalog`}</i>
        </Loader>
    }
    return <Layouts.CatalogLayout>
        <Layouts.CatalogHeader>
            <HiICons.HiOutlineDocumentSearch/>
            <div style={{color:'dodgerblue',fontSize:'x-large'}}><b>Discover </b></div>
            <small style={{fontSize: 'x-small', color: 'rgba(0,0,0,0.7)'}}> | catalog>discover </small>
            <div/>
        </Layouts.CatalogHeader>
            <Layouts.CatalogSearchLayout>
            <ReactiveBase
                theme={{
                    typography: {
                        fontSize:'small',
                    },
                    colors: {
                        titleColor: 'rgba(0,0,0,0.5)',
                    },
                    component: {
                        padding: 1
                    }
                }}
                app={`datahub-index`}
                enableAppbase={false}
                url={config.apiGateway.ESURL}
                transformRequest={transformRequest}
            >
                <DataSearch
                    innerClass={{input:'mainsearch'}}
                    autoSuggest={true}
                    showIcon={false}
                    fuzziness={"AUTO"}
                    componentId="SearchSensor"
                    filterLabel={`text`}
                    dataField={[
                        "label",
                        "name",
                        "description",
                        "region",
                        "topics",
                        "tags",
                    ]}
                    placeholder="Search anything"
                />
                <SelectedFilters/>
                <div style={{fontSize:'x-small',display:`grid`,columnGap:'1rem', gridTemplateColumns:'2fr 7fr'}}>
                    <div comment={`Left Panel`}>
                        <GlossarySearchComponent
                            innerClass={{input:'mini',list:'items'}}
                        />
                        <MultiList
                            innerClass={{input:'mini',list:'items'}}
                            title="Type"
                            showCheckbox={true}
                            showLoadMore={true}
                            showMissing={true}
                            renderNoResults={() => <p>Loading types</p>}
                            componentId="KindSensor"
                            filterLabel={`type`}
                            dataField="datahubKind"
                        />
                        <MultiList
                            innerClass={{input:'mini', list:'multilistresult'}}
                            showCheckbox={true}
                            showLoadMore={true}
                            showMissing={true}
                            showFilter={true}
                            filterLabel={`tags`}
                            renderNoResults={() => <p>Loading tags</p>}
                            componentId="TagSensor"
                            dataField="tags"
                            title="Tags"
                        />
                        <MultiList
                            innerClass={{input:'mini', list:'items'}}
                            showCheckbox={true}
                            showLoadMore={true}
                            showMissing={true}
                            showFilter={true}
                            renderNoResults={() => <p>Loading topics</p>}
                            filterLabel={`topic`}
                            componentId="TopicSensor"
                            dataField="topics"
                            title="Topics"
                        />
                        <MultiList
                            innerClass={{input:'mini', list:'items'}}
                            showCheckbox={true}
                            showLoadMore={true}
                            showSearch={true}
                            //showMissing={true}
                            //showFilter={true}
                            renderNoResults={() => <p>Loading regions</p>}
                            componentId="RegionSensor"
                            filterLabel={`region`}
                            dataField="region"
                            title="Regions"
                        />
                    </div>
                    <div>
                        <ReactiveList
                            react={{
                                and: ['RegionSensor', 'SearchSensor', 'GlossaryPathSensor','TagSensor', 'TopicSensor', 'KindSensor'],
                            }}
                            size={5}
                            pagination
                            paginationAt="bottom"
                            componentId="SearchResult"
                            renderItem={(hit) => {
                                return <Hit hit={hit}/>
                            }}
                        />
                    </div>
                </div>
            </ReactiveBase>
            </Layouts.CatalogSearchLayout>
    </Layouts.CatalogLayout>


}

export default Catalog;
