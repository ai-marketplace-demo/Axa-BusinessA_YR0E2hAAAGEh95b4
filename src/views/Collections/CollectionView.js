import {useEffect, useState} from "react";
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import {defineCustomElements} from "@revolist/revogrid/loader"; // webcomponent definition loader
import * as Components from "./components";

const CollectionView = (props) => {

    const [state, setState] = useState({
        edited: null,
        columns: [
            {
                prop: "type",
                name: "Type",
                autoSize: true
            },
            {
                prop: "name",
                name: "Name",
                autoSize: true
            },

            {
                prop: "link",
                name: "Link",
                autoSize: true

            }
        ],
        source: [
            {
                type: "Dashboard",
                name: "Revenue KPI ",
                link: "/dashboards/lijy"
            }
        ]
    });

    const afterEdit = ({detail}) => {
        setState({edited: detail});
    };

    useEffect(() => {
        defineCustomElements();
        console.log("defineCustomElements");
    })
    return <ObjectView
        title={"Finances"}
        back={{
            label: '< back to collections',
            link: '/collections'
        }}
        icon={<BsIcon.BsHeart/>}
        breadcrumbs={`collections/`}
        label={"xxx"}
        owner={`moshir.mikael@gmail.com`}
        tabs={["overview", "dashboards", "tables", "datasets"]}
    >
        <Components.Editor/>
        <div>D</div>
        <div>T</div>
        <div>DST</div>

    </ObjectView>
}


export default CollectionView;
