import React, { Component } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Video from "react-native-video";
import Slider from "react-native-slider";
import songs from "./mockData";
import Icon from 'react-native-vector-icons/Foundation';

const playButton = (<Icon name="play" color="#000" />)
const pauseButton = (<Icon name="pause" size={100} color="#000" />)
const nextButton = (<Icon name="next" size={100} color="#000" />)
const previousButton = (<Icon name="previous" size={100} color="#000" />)


class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: true,
      muted: false,
      shuffle: false,
      currentTime: 0,
      songIndex: 0,
      songs: songs[0].songs,
      songDuration: 1,
      songList: []
    };
  }


  componentWillMount(){
    this.getSongs();
  }

  getSongs = () => {
   
    fetch("https://api.jamendo.com/v3.0/tracks/?client_id=77203514&format=jsonpretty&order=popularity_month")
            .then( (response) => {
                return response.json() })   
                    .then( (json) => {
                        this.setState({songList: json.results});
                    });

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
        state.songIndex === state.songList.length - 1 ? 0 : state.songIndex + 1,
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

    var songProperties = [];

    for (let prop in this.state.songList[this.state.songIndex]) {
      songProperties.push(this.state.songList[this.state.songIndex][prop]);
    }
    
    console.log(this.state.songList)
    
    album_image = songProperties[11]
    audio = songProperties[12]
    songTitle = songProperties[1]
    
    return (
      <View style={{ flex: 3, flexDirection: 'column' }}>
        <Image
          resizeMode='contain'
          style={{flex:2, height: 30, alignContent:'center', marginTop: 20}}
          source={{uri: album_image}}
        /> 
        <Video
          source={{uri: audio}}
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
        <View style={{flex: 1}}>
          <View style={styles.timer}>
            <Text style={{flex: 1, marginLeft: 20}}>{formattedTime(this.state.currentTime)}</Text>
            <Text style={{flex: 1, marginLeft: 240}}>{formattedTime(this.state.songDuration)}</Text>
          </View>

          <View style={{flex: 6}}>
            <Text style={{alignSelf: 'center', fontSize: 20}} > {songTitle} </Text>
            <View style={styles.controls}>
              <TouchableOpacity style={styles.back} onPress={this.goBackward}>
                <Icon name="previous" color="#000" size={30}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.play} onPress={this.togglePlay}>
                {this.state.playing ? <Icon name="pause" color="#000" size={50} /> : <Icon name="play" color="#000" size={50} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.forward} onPress={this.goForward}>
                <Icon name="next" color="#000" size={30}/>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  controls: {
    alignItems: 'center',
    flex:3,
    flexDirection: 'row',
    width: window.width
  },
  back: {
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 3
  },
  play: {
    flex: 1,
    alignItems: 'center'
  },
  forward: {
    flex: 1,
    marginBottom: 3
  },
  timer: {
    flex: 2,
    flexDirection: 'row'
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
