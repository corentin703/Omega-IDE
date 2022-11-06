
import OmegaLogo from '@/img/logo-ide.svg';
import {Component, ReactNode, ReactNode} from 'react';

class GreetingLogo extends Component {
    render() {
        return (
            <img className="editor__panel__greeting__content__logo" src={OmegaLogo} alt="Omega Logo"/>
        );
    }
}

class GreetingTitle extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <h1 className="editor__panel__greeting__content__title">
                {this.props.children}
            </h1>
        );
    }
}

class GreetingVersion extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <h2 className="editor__panel__greeting__content__version">
                {this.props.children}
            </h2>
        );
    }
}

class Help extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__panel__greeting__content__help">
                {this.props.children}
            </div>
        );
    }
}

class HelpLine extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__panel__greeting__content__help__line">
                {this.props.children}
            </div>
        );
    }
}

class HelpLeft extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__panel__greeting__content__help__left">
                {this.props.children}
            </div>
        );
    }
}

class HelpRight extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__panel__greeting__content__help__right">
                {this.props.children}
            </div>
        );
    }
}

class HelpKey extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <span className="editor__panel__greeting__content__help__key">{this.props.children}</span>
        );
    }
}

class Greeting extends Component<{ children?: ReactNode }> {
    render() {
        return (
            <div className="editor__panel__greeting">
                <div className="editor__panel__greeting__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export {Greeting, GreetingLogo, GreetingTitle, GreetingVersion, Help, HelpLine, HelpLeft, HelpRight, HelpKey};

