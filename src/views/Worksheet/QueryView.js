import * as AiIcons from "react-icons/ai";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";

const QueryView = (props) => {
    return <ObjectView
        title={"My Query"}
        icon={<AiIcons.AiOutlineExperiment/>}
        breadcrumbs={`| make>queries>my query`}
        label={"xxx"}
        back={{
            link: '/queries',
            label: '< back to queries'
        }}
        owner={`moshir.mikael@gmail.com`}
        tabs={["Overview", "Editor"]}
    >
        <Components.Editor/>
        <div>S</div>
    </ObjectView>
}


export default QueryView;
