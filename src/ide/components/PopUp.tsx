
import React, { Component, ReactElement } from 'react';

class PopUp extends Component<{ children: ReactElement }> {
    render() {
    return (
            <div className="editor__popup">
                <div className="editor__popup__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class PopUpContent extends Component<{ children: ReactElement }> {
    render() {
        return (
            <div className="editor__popup__content__mid">
                {this.props.children}
            </div>
        );
    }
}

class PopUpButtons extends Component<{ children: ReactElement }> {
    render() {
        return (
            <div className="editor__popup__content__buttons">
                {this.props.children}
            </div>
        );
    }
}

type PopUpButtonProps = {
    autofocus: boolean;
    children: ReactElement;
    onClick: (userData: any) => void;
    userdata: any;
};

class PopUpButton extends Component<PopUpButtonProps> {
    constructor(props: PopUpButtonProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.onClick)
            this.props.onClick(this.props.userdata);
    }

    render() {
        return (
            <button 
                onClick={this.handleClick}
                ref={(ref) => {this.props.autofocus && ref !== null && ref.focus()}} 
                className="editor__popup__content__buttons__button"
            >
                {this.props.children}
            </button>
        );
    }
}

class PopUpBar extends Component<{ children: ReactElement }> {
    render() {
        return (
            <div className="editor__popup__content__bar">
                {this.props.children}
            </div>
        );
    }
}

class PopUpTitle extends Component<{ children: ReactElement }> {
    render() {
        return (
            <span className="editor__popup__content__bar__title">
                {this.props.children}
            </span>
        );
    }
}

type PopUpCloseProps = {
    children: ReactElement;
    onClick: (userData: any) => void;
    userdata: any;
};

class PopUpClose extends Component<PopUpCloseProps> {
    constructor(props: PopUpCloseProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.onClick)
            this.props.onClick(this.props.userdata);
    }

    render() {
        return (
            <i onClick={this.handleClick} className="editor__popup__content__bar__close material-icons">
                close
            </i>
        );
    }
}

export {PopUp, PopUpContent, PopUpButtons, PopUpButton, PopUpBar, PopUpTitle, PopUpClose};

