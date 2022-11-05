
import React, { Component, ReactElement } from 'react';

type ProjectProps = {
    name: string;
    renaming: boolean;
    selected: boolean;
    loading: boolean;
    locked: boolean;
    nousb: boolean;
    userdata: any;
    onRemove: (userdata: any) => void;
    onSelect: (userdata: any) => void;
    onNewFile: (userdata: any) => void;
    onRename: (userdata: any, name: string) => void;
    onCancel: (userdata: any) => void;
    onSendDevice: (userdata: any) => void;
    onZip: (userdata: any) => void;
    onRunSimu: (userdata: any) => void;
    children: ReactElement;
};

type ProjectStates = {
    name: string;
    oldName: string,
    isRenaming: boolean;
    ctx: {
        x: number;
        y: number;
        open: boolean;
    };
};


export default class Project extends Component<ProjectProps, ProjectStates> {
    constructor(props: ProjectProps) {
        super(props);
        
        this.state = {
            name: props.name,
            oldName: "",
            
            isRenaming: props.renaming,
            ctx: {
                open: false,
                x: 0,
                y: 0,
            },
        };
        
        this.handleChange       = this.handleChange.bind(this);
        this.handleRename       = this.handleRename.bind(this);
        this.handleRemove       = this.handleRemove.bind(this);
        this.handleNewFile      = this.handleNewFile.bind(this);
        this.handleClick        = this.handleClick.bind(this);
        this.handleValidate     = this.handleValidate.bind(this);
        this.handleCancel       = this.handleCancel.bind(this);
        this.handleKeyDown      = this.handleKeyDown.bind(this);
        this.stopBubble         = this.stopBubble.bind(this);
        this.handleContextMenu  = this.handleContextMenu.bind(this);
        this.handleContextClose = this.handleContextClose.bind(this);
        this.handleRunSimu      = this.handleRunSimu.bind(this);
        this.handleSaveDevice   = this.handleSaveDevice.bind(this);
        this.handleZip          = this.handleZip.bind(this);
    }

    handleContextClose(event: any) {
        event.preventDefault();
        this.stopBubble(event);
        
        this.setState({
            ...this.state,
            ctx: {
                ...this.state.ctx,
                open: false,
            }
        });
    }

    handleContextMenu(event: any) {
        event.preventDefault();
        this.stopBubble(event);
        
        if (!this.state.isRenaming) {

            this.setState({
                ...this.state,
                ctx: {
                    open: true,
                    x: event.pageX,
                    y: event.pageY,
                }
            });
        }
    }
    
    handleChange(event: any) {
        if (this.state.isRenaming) {
            this.setState({
                ...this.state,
                name: event.target.value,
            });
        }
    }
    
    handleRename(event: any) {
        this.stopBubble(event);
        this.handleContextClose(event);

        if (this.props.locked)
            return;

        this.setState({
            ...this.state,
            isRenaming: true,
            oldName: this.state.name
        });
    }
    
    handleRemove(event: any) {
        this.stopBubble(event);
        this.handleContextClose(event);

        if (this.props.locked === true)
            return;

        if (this.props.onRemove)
            this.props.onRemove(this.props.userdata);
    }
    
    handleClick(event: any) {
        this.stopBubble(event);
        if (this.props.onSelect)
            this.props.onSelect(this.props.userdata);
    }
    
    handleValidate(event: any) {
        this.stopBubble(event);

        if (this.props.locked === true)
            return;

        if (this.state.isRenaming) {
            if (this.props.onRename)
                this.props.onRename(this.props.userdata, this.state.name);
            this.setState({
                ...this.state,
                isRenaming: false
            });
        }
    }

    handleCancel(event: any) {
        this.stopBubble(event);
        if (this.state.isRenaming) {
            this.setState({
                ...this.state,
                isRenaming: false,
                name: this.state.oldName
            });

            if (this.props.onCancel)
                this.props.onCancel(this.props.userdata);
        }
    }
    
    handleNewFile(event: any) {
        this.stopBubble(event);
        this.handleContextClose(event);

        if (this.props.locked === true)
            return;

        if (this.props.onNewFile)
            this.props.onNewFile(this.props.userdata);
    }

    handleKeyDown(event: any) {
        if (event.key === 'Enter') {
            this.handleValidate(event);
        }
        if (event.key === 'Escape') {
            this.handleCancel(event);
        }
    }
    
    stopBubble(event: any) {
        event.stopPropagation();
    }
    
    handleSaveDevice(event: any) {
        this.stopBubble(event);
        this.handleContextClose(event);

        if (this.props.locked === true || this.props.nousb === true)
            return;

        this.props.onSendDevice(this.props.userdata);
    }

    handleRunSimu(event: any) {
        this.stopBubble(event);
        this.handleContextClose(event);

        if (this.props.locked === true)
            return;

        this.props.onRunSimu(this.props.userdata);
    }

    handleZip(event: any) {
        this.stopBubble(event);
        this.handleContextClose(event);

        if (this.props.locked === true)
            return;

        this.props.onZip(this.props.userdata);
    }

    render() {
        return (
            <div 
                onContextMenu={this.handleContextMenu} 
                onClick={this.handleClick} 
                className={"editor__leftmenu__dropdown" + (this.props.selected ? " editor__leftmenu__dropdown-selected" : "") + (this.props.loading ? " editor__leftmenu__dropdown-loading" : "")}
            >
                <div className={"editor__leftmenu__dropdown__title" + (this.state.isRenaming ? " editor__leftmenu__dropdown__title-rename" : "")}>
                    <i className="editor__leftmenu__dropdown__title__chevron material-icons">keyboard_arrow_right</i>
                    <span className="editor__leftmenu__dropdown__title__content">{this.props.name.toUpperCase()}</span>
                    <input 
                        ref={(ref) => {if (this.state.isRenaming && ref !== null){ref.focus()}}} 
                        onClick={this.stopBubble} 
                        onKeyDown={this.handleKeyDown} 
                        value={this.state.name}
                        onChange={this.handleChange} 
                        type="text" 
                        className="editor__leftmenu__dropdown__title__input"
                    />
                    <div className="editor__leftmenu__dropdown__title__actions editor__leftmenu__dropdown__title__actions__normal">
                        <i title="Create file" onClick={this.handleNewFile} className="editor__leftmenu__dropdown__title__actions__icon material-icons">note_add</i>
                        <i title="Rename project" onClick={this.handleRename} className="editor__leftmenu__dropdown__title__actions__icon material-icons">create</i>
                        <i title="Remove project" onClick={this.handleRemove} className="editor__leftmenu__dropdown__title__actions__icon material-icons">delete</i>
                        <i title="Remove project" onClick={this.handleContextMenu} className="editor__leftmenu__dropdown__title__actions__icon material-icons">more_horiz</i>
                    </div>
                    <div className="editor__leftmenu__dropdown__title__actions editor__leftmenu__dropdown__title__actions__rename">
                        <i onClick={this.handleValidate} className="editor__leftmenu__dropdown__title__actions__icon material-icons">done</i>
                        <i onClick={this.handleCancel} className="editor__leftmenu__dropdown__title__actions__icon material-icons">clear</i>
                    </div>
                    <i className="editor__leftmenu__dropdown__title__loading material-icons" >
                        hourglass_empty
                    </i>
                    <div onClick={this.handleCancel} className="editor__leftmenu__dropdown__title__renamediv"></div>
                </div>
                <div 
                    className={"editor__menu" + (this.state.ctx.open ? " editor__menu-open" : "")} 
                    style={(this.state.ctx.open ? {left: this.state.ctx.x, top: this.state.ctx.y} : {})}
                >
                    <div onClick={this.handleNewFile} className="editor__menu__element">
                        <i className="editor__menu__element__icon material-icons">note_add</i>
                        <span className="editor__menu__element__name">Add file</span>
                    </div>
                    <div onClick={this.handleRename} className="editor__menu__element">
                        <i className="editor__menu__element__icon material-icons">create</i>
                        <span className="editor__menu__element__name">Rename project</span>
                    </div>
                    <div onClick={this.handleRemove} className="editor__menu__element">
                        <i className="editor__menu__element__icon material-icons">delete</i>
                        <span className="editor__menu__element__name">Remove project</span>
                    </div>
                    <div onClick={this.handleRunSimu} className="editor__menu__element editor__menu__element-separator">
                        <i className="editor__menu__element__icon material-icons">play_arrow</i>
                        <span className="editor__menu__element__name">Run in simulator</span>
                    </div>
                    <div onClick={this.handleSaveDevice} className={"editor__menu__element" + (this.props.nousb ? " editor__menu__element-locked" : "")}>
                        <i className="editor__menu__element__icon material-icons">usb</i>
                        <span className="editor__menu__element__name">Send to device</span>
                    </div>
                    <div onClick={this.handleZip} className="editor__menu__element editor__menu__element-separator">
                        <i className="editor__menu__element__icon material-icons">get_app</i>
                        <span className="editor__menu__element__name">Download as zip</span>
                    </div>
                </div>
                <div onContextMenu={this.handleContextClose} onClick={this.handleContextClose} className={"editor__menu__closer"} />
                <ul className="editor__leftmenu__dropdown__content">
                    {this.props.children}
                </ul>
            </div>
        )
    }
}
