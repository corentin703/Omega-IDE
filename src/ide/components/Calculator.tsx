
import React, { Component, ReactNode } from 'react';

type CalculatorSearchProps = {
    onClick: (event: React.MouseEvent) => void
};

function CalculatorSearch(props: CalculatorSearchProps) {
    return (
        <div className="editor__calculator__indicator">
            <i className="editor__calculator__indicator__icon material-icons">search</i>
            <p className="editor__calculator__indicator__text">
                Looking for device...<br/>
                Click <span onClick={props.onClick} className="editor__calculator__indicator__text__link">here</span> to trigger a manual detection.
            </p>
        </div>
    );
}

type CalculatorInfoProps = {
    name: string;
    value: string;
};

function CalculatorInfo(props: CalculatorInfoProps) {
    return (
        <tr className="editor__calculator__infos__line">
            <td className="editor__calculator__infos__name">{props.name}</td>
            <td className="editor__calculator__infos__value">{props.value}</td>
        </tr>
    );
}

type CalculatorInfoListProps = {
    children?: ReactNode;
};

type CalculatorInfoListState = {
    selected: boolean;
};

class CalculatorInfoList extends Component<CalculatorInfoListProps, CalculatorInfoListState> {
    constructor(props: CalculatorInfoListProps) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
        
        this.state = {
            selected: true
        }
    }

    handleClick(event: React.MouseEvent) {
        event.stopPropagation();
        
        this.setState({
            selected: !this.state.selected
        });
    }

    render() {
        return (
            <div onClick={this.handleClick} className={"editor__leftmenu__dropdown" + (this.state.selected ? " editor__leftmenu__dropdown-selected" : "")}>
                <div className="editor__leftmenu__dropdown__title">
                    <i className="editor__leftmenu__dropdown__title__chevron material-icons">keyboard_arrow_right</i>
                    <span className="editor__leftmenu__dropdown__title__content">INFORMATIONS</span>
                </div>
                <div className="editor__leftmenu__dropdown__content" onClick={(e) => e.stopPropagation()}>
                    <table className="editor__calculator__infos">
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

type CalculatorStorageProps = {
    children?: ReactNode;
    onZipDownload: () => void;
    locked: boolean;
};

type CalculatorStorageState = {
    selected: boolean;
};

class CalculatorStorage extends Component<CalculatorStorageProps, CalculatorStorageState> {
    constructor(props: CalculatorStorageProps) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
        
        this.state = {
            selected: true
        }
    }

    handleClick(event: React.MouseEvent) {
        event.stopPropagation();
        
        this.setState({
            selected: !this.state.selected
        });
    }

    render() {
        return (
            <div onClick={this.handleClick} className={"editor__leftmenu__dropdown" + (this.state.selected ? " editor__leftmenu__dropdown-selected" : "")}>
                <div className="editor__leftmenu__dropdown__title">
                    <i className="editor__leftmenu__dropdown__title__chevron material-icons">keyboard_arrow_right</i>
                    <span className="editor__leftmenu__dropdown__title__content">STORAGE</span>
                    <div className="editor__leftmenu__dropdown__title__actions editor__leftmenu__dropdown__title__actions__normal">
                        <i 
                            onClick={(event) => {event.stopPropagation(); this.props.onZipDownload()}} 
                            title="Download as zip"
                            className="editor__leftmenu__dropdown__title__actions__icon material-icons"
                        >
                            get_app
                        </i>
                    </div>
                </div>
                <ul className="editor__leftmenu__dropdown__content">
                    {this.props.children}
                </ul>
            </div>
        );
    }
}

type CalculatorFileProps = {
    onDelete: (userdata: any) => void;
    userdata: any;
    name: string;
};

function CalculatorFile(props: CalculatorFileProps) {
    return (
        <li 
            onContextMenu={(event) => {event.stopPropagation(); event.preventDefault()}} 
            onClick={(event) => event.stopPropagation()} 
            className="editor__leftmenu__dropdown__content__element"
        >
            <i className="editor__leftmenu__dropdown__content__element__icon material-icons">insert_drive_file</i>
            <span className="editor__leftmenu__dropdown__content__element__name">{props.name}</span>
            <div className="editor__leftmenu__dropdown__content__element__actions editor__leftmenu__dropdown__content__element__actions__normal">
                <i 
                    onClick={(e) => {e.stopPropagation(); props.onDelete(props.userdata)}} 
                    title="Delete" 
                    className="editor__leftmenu__dropdown__content__element__actions__icon material-icons"
                >
                    delete
                </i>
            </div>
        </li>
    );
}

function CalculatorConnected() {
    return (
        <div className="editor__calculator__indicator">
            <i className="editor__calculator__indicator__icon material-icons">done</i>
            <p className="editor__calculator__indicator__text">
                Device connected.
            </p>
        </div>
    );
}

function CalculatorError() {
    return (
        <div className="editor__calculator__indicator">
            <i className="editor__calculator__indicator__icon material-icons">clear</i>
            <p className="editor__calculator__indicator__text">
                You calculator was detected but something is wrong with it.<br/>
                Try the <a className="editor__calculator__indicator__text__link" rel="noopener noreferrer" href="https://workshop.numworks.com/devices/rescue" target="_blank">recovery updater</a>.
            </p>
        </div>
    );
}

export {CalculatorSearch, CalculatorConnected, CalculatorError, CalculatorInfoList, CalculatorInfo, CalculatorStorage, CalculatorFile};
