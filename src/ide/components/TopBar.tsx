
import { Component, ReactElement } from 'react';

function TopBarTabs(props: { children: ReactElement }) {
    return (
        <div className="editor__panel__topbar__tabs">
            <div className="editor__panel__topbar__tabs__container">
                {props.children}  
            </div>
        </div>
    )
}

type TopBarMoreProps = {
    onClick: () => void;
}

class TopBarMore extends Component<TopBarMoreProps> {
    constructor(props: TopBarMoreProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        if (this.props.onClick)
            this.props.onClick();
    }

    render() {
        return (
            <div onClick={this.handleClick} className="editor__panel__topbar__more">
                <i className="editor__panel__topbar__more__icon material-icons">save</i>
            </div>
        )
    }
}

function TopBarFileName(props: { children: ReactElement }) {
    return (
        <div className="editor__panel__topbar__filename">
            <span className="editor__panel__topbar__filename__content">
                {props.children}
            </span>
        </div>
    )
}

type TopBarTabProps = {
    onClick: (userdata: any) => void;
    onClose: (userdata: any) => void;
    userdata: any;
    selected: boolean;
    unsaved: boolean;
    children: ReactElement;
}

class TopBarTab extends Component<TopBarTabProps> {
    constructor(props: TopBarTabProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    
    handleClick(event: React.MouseEvent) {
        event.stopPropagation();
        
        if (this.props.onClick)
            this.props.onClick(this.props.userdata);
    }
    
    handleClose(event? : React.MouseEvent) {
        event?.stopPropagation();
        if (this.props.onClose)
            this.props.onClose(this.props.userdata);
    }
    
    render() {
        return (
            <div 
                onClick={this.handleClick}
                className={`editor__panel__topbar__tab ${this.props.selected && "editor__panel__topbar__tab-selected"}`}
            >
                <span className="editor__panel__topbar__tab__name">
                    {this.props.children}
                </span>
                <i 
                    onClick={this.handleClose}
                    className={`material-icons editor__panel__topbar__tab__close ${this.props.unsaved && "editor__panel__topbar__tab__close-unsaved"}`}
                >
                    close
                </i>
            </div>
        )
    }
}

function TopBar(props: { children: ReactElement }) {
    return (
        <div className="editor__panel__topbar">
            {props.children}
        </div>
    )
}

export {TopBarTabs, TopBarMore, TopBarFileName, TopBarTab, TopBar};

