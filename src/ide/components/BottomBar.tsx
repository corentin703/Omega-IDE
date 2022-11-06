
import { Component, ReactNode } from 'react';

class BottomBar extends Component<{ children?: ReactNode }> {
  render() {
    return (
      <div className="editor__bottombar">
        {this.props.children}
      </div>
    );
  }
}

type BottomBarElementProps = {
  locked?: boolean;
  hoverable?: boolean;
  right?: boolean;
  onClick?: (userdata: any) => void;
  userdata?: any;
  icon?: string;
  children?: ReactNode;
};

class BottomBarElement extends Component<BottomBarElementProps> {
  constructor(props: BottomBarElementProps) {
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
    const icon = this.props.icon
      ? (
          <i className="editor__bottombar__content__icon material-icons">{this.props.icon}</i>
        )
      : <></>;

    return (
      <div 
        onClick={this.handleClick} 
        className={`editor__bottombar__content ${this.props.hoverable && "editor__bottombar__content-hoverable"} ${this.props.locked && "editor__bottombar__content-locked"} ${this.props.right && "editor__bottombar__content-right"}`}
      >
        {icon}
        <div className="editor__bottombar__content__text">{this.props.children}</div>
      </div>
    );
  }
}

export { BottomBar, BottomBarElement };

