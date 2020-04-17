import React, { Component } from 'react';
// import NativeListener from 'react-native-listener';
import "video-react/dist/video-react.css"; // import css
import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  PlayToggle
} from 'video-react';
// https://video-react.js.org
import { Twitter, LinkedIn, HackerNews, Reddit } from 'react-social-sharing'
import PreviousVideoButton from './PreviousVideoButton';
import {data} from "./data.yaml";


class VideoOverlay extends Component {

  constructor(props) {
    super(props);
    this.handleOption = this.handleOption.bind(this);
  }

  handleOption(option) {
    this.props.onChange(option);
  }

  renderOptions() {
    const options = [];
    for (let [_, option] of Object.entries(this.props.options)) {
      options.push(
        <div key={_} className="Option">
          <a href="#next" onClick={this.handleOption.bind(this, option) }>{option.text}</a>
        </div>
      );
    }
    return options;
  }

  render() {
    return (
      <div className={"Overlay" + (this.props.visible ? " visible" : "")}>
          {this.props.options &&
          <div className="Options">
            {this.renderOptions()}
          </div>
          }
          {!this.props.options &&
          <div className="Congrats">
            <p>
              Congrats!
              <br/><br/>
              You've completed this interactive tutorial =)
              <br/><br/>
              <Twitter link="#"/>
              <Reddit link="#"/>
              <HackerNews link="#"/>
            </p>
          </div>
          }
      </div>
    );
  }
}

export default class Video extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showOverlay: false,
      source: data.source,
      options: data.options,
      loading: false,
      previous: [],
    };
    this.onChange = this.onChange.bind(this);
    this.backToPreviousVideo = this.backToPreviousVideo.bind(this);
  }

  componentDidMount() {
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));
  }

  nextVideo(option) {
    this.setState({
      source: option.source,
      options: option.options,
      loading: false,
      previous: this.state.previous.concat([{
        source: this.state.source,
        options: this.state.options,
      }]), // this is just an append :) 
    })
    this.player.load();
  }

  previousVideo(option) {
    this.setState({
      source: option.source,
      options: option.options,
      loading: false, 
    })
    this.player.load();
  }

  backToPreviousVideo() {
    if (this.state.previous.length) {
      this.player.pause();
      const prev = this.state.previous.pop();
      this.setState({
        showOverlay: false,
        loading: true,
      });
      // timeout needed for UI transition
      setTimeout(this.previousVideo.bind(this, prev), 500);
    } else {
      alert("No previous video!");
    }
  }

  onChange(option) {
    this.setState({
      showOverlay: false,
      loading: true,
    })
    // timeout needed for UI transition
    setTimeout(this.nextVideo.bind(this, option), 500);
  }

  handleStateChange(state) {
    // nothing to do if loading status
    if (this.state.loading) return; 

    const {currentTime, duration} = state;

    if (currentTime >= duration - 5) {
      // show next-video options during last 5 seconds
      this.setState({
        showOverlay: true,
      })
    } else {
      // hide options otherwise
      this.setState({
        showOverlay: false,
      })
    }

    // seek back if less 1 second to the end (5s loop)
    if (currentTime >= duration - 3 && this.state.options) {
      console.log(this);
      //this.player.seek(duration - 5);
      this.player.pause();
    }
  }

  render() {
            
    return (
      <div className="VideoContainer">
        <Player
          ref={c => {
            this.player = c;
          }}
          fluid
          playsInline
          preload="auto"
          autoPlay={true}
          poster="/assets/poster.png"
        >

          <source src={this.state.source} />

          <ControlBar disableDefaultControls={true} autoHide={true}>
            <PlayToggle />
            <ReplayControl seconds={10} order={1.1} />
            <ForwardControl seconds={30} order={1.2} />
            <PreviousVideoButton order={2} onClick={this.backToPreviousVideo} disabled={this.state.previous.length === 0} />
          </ControlBar>

        </Player>

        <VideoOverlay
          visible={this.state.showOverlay} 
          onChange={this.onChange}
          options={this.state.options}
        />

      </div>
    );
  }
}
