
import {Component, ReactNode, ReactNode} from 'react';

class LeftBar extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__leftbar">
                {this.props.children}
            </div>
        );
    }
}

class LeftBarTop extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__leftbar__container editor__leftbar__container-top">
                {this.props.children}
            </div>
        );
    }
}

class LeftBarBottom extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__leftbar__container editor__leftbar__container-bottom">
                {this.props.children}
            </div>
        );
    }
}

type LeftBarActionProps = {
    children?: ReactNode;
    locked?: boolean;
    selected?: boolean;
    onClick?: (userdata: any) => void;
    userdata?: any;
    img?: string;
    icon?: string;
}

class LeftBarAction extends Component<LeftBarActionProps> {
    constructor(props: LeftBarActionProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        if (this.props.locked)
            return;

        if (this.props.onClick) {
            this.props.onClick(this.props.userdata);
        }
    }

    render() {
        const content = this.props.img 
            ? <img className="editor__leftbar__icon__image" src={this.props.img} alt="Profile" />
            : <i className="editor__leftbar__icon__icon material-icons">{this.props.icon}</i>;
        
        return (
            <div 
                onClick={this.handleClick}
                className={`editor__leftbar__icon ${this.props.selected ? "editor__leftbar__icon-selected" : ""} ${this.props.locked ? " editor__leftbar__icon-locked" : ""}`}
            >
                {content}
            </div>
        );
    }
}

export {LeftBar, LeftBarTop, LeftBarBottom, LeftBarAction};

