import React, { Component } from 'react';
import classNames from 'classnames';

export default class PreviousVideoButton extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick();
  }

  render() {
    const { className } = this.props;

    return (
      <a
        title="Back to previous video"
        ref={c => {
          this.button = c;
        }}
        className={classNames(className, {
          'video-react-control': true,
          'video-react-button': true
        })}
        href="#previous"
        style={{
          backgroundImage:
            'url(data:image/png;base64,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)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '20px 20px',
        }}
        tabIndex="0"
        onClick={this.handleClick}
      />
    );
  }
}