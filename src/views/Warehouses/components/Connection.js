import * as Form from "../../../components/form"


const Connection = ({warehouse}) => {
    const jdbc = `jdbc:redshift://${warehouse.endpoint || '-'}:${warehouse.port}/${warehouse.databaseName}`;
    const odbc = `Driver={Amazon Redshift (x64)}; Server=${warehouse.endpoint || '-'}; Database=${warehouse.databaseName}`;
    return <Form.EditForm
        onSubmit={()=>{}}
        editable={false}
        initialValues={
            {...warehouse, jdbc, odbc}
        }

        fields={[
            {
                type: Form.FormFieldTypes.Input,
                name: 'endpoint',
                label: "Endpoint",
                icon: 'linkify',
            },
            {
                type: Form.FormFieldTypes.Input,
                name: 'port',
                label: "Port",
                icon: 'info'
            },
            {
                type: Form.FormFieldTypes.Input,
                name: 'jdbc',
                label: "JDBC URL",
                icon: 'info'
            },
            {
                type: Form.FormFieldTypes.Input,
                name: 'odbc',
                label: "ODBC URL",
                icon: 'info'
            },
        ]}
    />
}

export default Connection;
