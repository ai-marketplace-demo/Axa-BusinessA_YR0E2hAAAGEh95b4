import {Link} from "react-router-dom";
import {TableContainer} from "../../../components/table";

const ChildList = ({organization}) => {
    return <TableContainer
        columns={[
            {label: "Name", key: "label"},
            {label: "Aws AccountId", key: 'AwsAccountId'},
            {label: 'Region', key: "region"},
            {label: "Admins", key: "SamlGroupName"},
            {label: "Created", key: "created"},
            {label: "Created By", key: "owner"},
        ]}
        rows={[
            {
                label: 'my env',
                owner: 'moshirm@amazon.fr',
                AwsAccountId: '11111111111',
                SamlGroupName: "team X",
                region: "eu-west-1",
                created: (new Date().toISOString())
            },
            {
                label: <Link to={`/environment/uuu`}>myenv</Link>,
                owner: 'moshirm@amazon.fr',
                AwsAccountId: '11111111111',
                SamlGroupName: "team 2",
                region: "eu-west-1",
                created: (new Date().toISOString())
            }
        ]}
    />
}

export default ChildList;
