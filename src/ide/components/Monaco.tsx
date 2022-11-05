
import React, { Component } from 'react';
import MonacoEditor from '@monaco-editor/react';
import ReactResizeDetector from 'react-resize-detector';
import * as monacoTypes from 'monaco-editor/esm/vs/editor/editor.api';

type IStandaloneCodeEditor = monacoTypes.editor.IStandaloneCodeEditor;

type MonacoProps = {
    value?: string;
    onChange: (userdata: any, newValue?: string) => void;
    userdata: any;
};

type MonacoState = {
    editor: IStandaloneCodeEditor | null;
    monaco: typeof monacoTypes | null;
};

export default class Monaco extends Component<MonacoProps, MonacoState> {

    constructor(props: MonacoProps) {
        super(props);
        
        this.state = {
            editor: null,
            monaco: null
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.editorDidMount = this.editorDidMount.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    editorDidMount(editor: IStandaloneCodeEditor, monaco: typeof monacoTypes) {
        this.setState({
            editor: editor,
            monaco: monaco
        });
    }
    
    handleResize() {
        if (this.state.editor !== null)
            this.state.editor.layout();
    }
    
    handleChange(newValue?: string) {
        if (this.props.onChange)
            this.props.onChange(this.props.userdata, newValue);
    }

    render() {
        return (
            <ReactResizeDetector handleWidth handleHeight onResize={this.handleResize}>
                <div className="editor__panel__monaco">
                    <MonacoEditor
                        width="100%"
                        height="100%"
                        language="python"
                        theme="vs-dark"
                        value={this.props.value}
                        onChange={this.handleChange}
                        onMount={this.editorDidMount}
                    />
                </div>
            </ReactResizeDetector>
        )
    }
}

