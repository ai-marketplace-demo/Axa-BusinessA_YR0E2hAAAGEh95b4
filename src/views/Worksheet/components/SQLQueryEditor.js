import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/sql/sql');


const SQLQueryEditor = ({environment,sql,disabled,onChange})=>{
    function onSelect(event, data){
        //console.log("text =",event.doc.getSelection())
        console.log("onSelection.event.doc", event.doc);
    }
    return <div
            style={{width:'100%'}}>
        <CodeMirror
        value={sql}
        onSelection={onSelect}
        onBeforeChange={(editor, data, value) =>  onChange(value)}
        options={{
            mode: 'sql',
            //theme: 'material',
            readOnly : disabled,
            lineNumbers: true
        }}
        onChange={(editor, data, value) => {
            onChange&&onChange(value);
        }}
    />
    </div>
}

export default SQLQueryEditor;
