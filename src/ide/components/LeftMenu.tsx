
import {Component, ReactNode} from 'react';

type LeftMenuProps = {
    shown: boolean;
    children?: ReactNode;
};

class LeftMenu extends Component<LeftMenuProps> {
    render() {
        return (
            <div className={"editor__leftmenu" + (this.props.shown ? " editor__leftmenu__shown" : "")}>
                {this.props.children}
            </div>
        );
    }
}

class LeftMenuTitle extends Component<{ children?: string }> {
    render() {
        return (
            <div className="editor__leftmenu__title">
                <span className="editor__leftmenu__title__content">
                    {this.props.children}
                </span>
            </div>
        );
    }
}

class LeftMenuContent extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__leftmenu__content">
                {this.props.children}
            </div>
        );
    }
}

class LeftMenuActions extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__leftmenu__actions">
                {this.props.children}
            </div>
        );
    }
}

type LeftMenuActionProps = {
    children?: ReactNode;
    onClick: (userdata: any) => void;
    userdata?: any;
    icon: string;
}

class LeftMenuAction extends Component<LeftMenuActionProps> {
    constructor(props: LeftMenuActionProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.userdata);
        }
    }
    
    render() {
        return (
            <i onClick={this.handleClick} className="editor__leftmenu__actions__icon material-icons">{this.props.icon}</i>
        )
    }
}

export {LeftMenu, LeftMenuTitle, LeftMenuContent, LeftMenuActions, LeftMenuAction};

