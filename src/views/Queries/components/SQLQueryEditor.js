import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/sql/sql');


const SQLQueryEditor = ({environment,sql,onChange})=>{
    return <CodeMirror
        value={sql}

        options={{
            mode: 'sql',
            //theme: 'material',
            lineNumbers: true
        }}
        onChange={(editor, data, value) => {
            onChange&&onChange(value);
        }}
    />
}

export default SQLQueryEditor;
