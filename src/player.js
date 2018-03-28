import React, { Component } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Video from "react-native-video";
import Slider from "react-native-slider";
import songs from "./mockData";

class Player extends Component {
  constructor() {
    super();
    this.state = {
      playing: true,
      muted: false,
      shuffle: false,
      currentTime: 0,
      songIndex: 0,
      songs: songs[0].songs,
      songDuration: 1
    };
  }

  startCurrSong = () => {
    this.video.seek(0);
  };

  togglePlay = () => {
    this.setState(state => ({ playing: !state.playing }));
  };

  toggleVolume = () => {
    this.setState(state => ({ muted: !state.muted }));
  };

  toggleShuffle = () => {
    this.setState(state => ({ shuffle: !state.shuffle }));
  };

  goBackward = () => {
    if (this.state.currentTime < 3 && this.state.songIndex !== 0) {
      this.setState(state => ({
        songIndex: state.songIndex - 1,
        currentTime: 0
      }));
    } else {
      this.setState({
        currentTime: 0
      });
    }
    this.startCurrSong();
  };

  goForward = () => {
    this.setState(state => ({
      songIndex:
        state.songIndex === state.songs.length - 1 ? 0 : state.songIndex + 1,
      currentTime: 0
    }));
    this.startCurrSong();
  };

  randomSongIndex = () => {
    const maxIndex = this.props.songs.length - 1;
    const random = Math.floor(Math.random() * maxIndex);
    if (random !== this.state.songIndex) {
      return random;
    } else {
      return this.randomSongIndex();
    }
  };

  setTime = params => {
    this.setState({ currentTime: params.currentTime });
  };

  onLoad = params => {
    this.setState({ songDuration: params.duration });
  };

  onSlide = slide => {
    this.setState({ slide });
    const seconds = slide * this.state.songDuration;
    this.video.seek(seconds);
  };

  secondToSlider = () => this.state.currentTime / this.state.songDuration;

  render() {
    const song = this.state.songs[this.state.songIndex];
    return (
      <View style={{ flex: 1 }}>
        <Video
          source={{ uri: song.url }}
          volume={this.state.muted ? 0 : 1.0}
          muted={false}
          paused={!this.state.playing}
          onLoad={this.onLoad}
          onProgress={this.setTime}
          onEnd={this.goForward}
          repeat={false}
          ref={v => {
            this.video = v;
          }}
        />
        <Slider value={this.secondToSlider()} onValueChange={this.onSlide} />
        <Text>{this.state.songDuration}</Text>
        <TouchableOpacity onPress={this.goBackward}>
          <Text>Go back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.togglePlay}>
          <Text>{this.state.playing ? "Pause" : "Play"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goForward}>
          <Text>Go forward</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000"
  },
  header: {
    marginTop: 17,
    marginBottom: 17,
    width: window.width
  },
  headerClose: {
    position: "absolute",
    top: 10,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center"
  },
  songImage: {
    marginBottom: 20
  },
  songTitle: {
    color: "white",
    fontFamily: "Helvetica Neue",
    marginBottom: 10,
    marginTop: 13,
    fontSize: 19
  },
  albumTitle: {
    color: "#BBB",
    fontFamily: "Helvetica Neue",
    fontSize: 14,
    marginBottom: 20
  },
  controls: {
    flexDirection: "row",
    marginTop: 30
  },
  back: {
    marginTop: 22,
    marginLeft: 45
  },
  play: {
    marginLeft: 50,
    marginRight: 50
  },
  forward: {
    marginTop: 22,
    marginRight: 45
  },
  shuffle: {
    marginTop: 26
  },
  volume: {
    marginTop: 26
  },
  sliderContainer: {
    width: window.width - 40
  },
  timeInfo: {
    flexDirection: "row"
  },
  time: {
    color: "#FFF",
    flex: 1,
    fontSize: 10
  },
  timeRight: {
    color: "#FFF",
    textAlign: "right",
    flex: 1,
    fontSize: 10
  },
  slider: {
    height: 20
  },
  sliderTrack: {
    height: 2,
    backgroundColor: "#333"
  },
  sliderThumb: {
    width: 10,
    height: 10,
    backgroundColor: "#f62976",
    borderRadius: 10 / 2,
    shadowColor: "red",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 1
  }
});

function withLeadingZero(amount) {
  if (amount < 10) {
    return `0${amount}`;
  } else {
    return `${amount}`;
  }
}

function formattedTime(timeInSeconds) {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds - minutes * 60;

  if (isNaN(minutes) || isNaN(seconds)) {
    return "";
  } else {
    return `${withLeadingZero(minutes)}:${withLeadingZero(seconds.toFixed(0))}`;
  }
}

module.exports = Player;
