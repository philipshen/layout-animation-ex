import React from 'react';
import { StyleSheet, Text, View, LayoutAnimation, Button, TextInput, Animated, UIManager, Platform } from 'react-native';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const AnimationTypeEnum = {
  spring: true,
  linear: true,
  ease: true,
  keyboard: true,
  fade: true,
  scaleLinear: true,
  scaleSpring: true
}
const AnimationType = keyMirror(AnimationTypeEnum)

const animationConfigs = new Map([
  [AnimationType.spring, {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.5
    },
  }],
  [AnimationType.linear, {
    duration: 300,
    create: {
      initialVelocity: 1000,
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.linear
    },
    update: {
      type: LayoutAnimation.Types.linear
    }
  }],
  [AnimationType.ease, {
    duration: 800,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut
    }
  }],
  [AnimationType.keyboard, {
    duration: 10000, // Doesn't matter
    update: {
      type: LayoutAnimation.Types.keyboard
    }
  }],
  [AnimationType.scaleLinear, {
    duration: 600,
    update: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.scaleXY
    }
  }],
  [AnimationType.scaleSpring, {
    duration: 600,
    update: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: 0.6
    }
  }],
  [AnimationType.fade, {
    duration: 600,
    update: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity
    }
  }]
]);

function keyMirror(obj) {
  var ret = {};
  var key;
  !(obj instanceof Object && !Array.isArray(obj)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'keyMirror(...): Argument must be an object.') : invariant(false) : void 0;
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      animation: AnimationType.linear,
      isViewOnTheLeft: true,
      scaled: false,
      keyboardVisible: false
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.hiddenTextInput} ref={ref => this.hiddenTextInput = ref} />
        <Text style={styles.currentAnimationText}>Current animation: {this.state.animation}</Text>
        <View style={styles.typeButtonContainer}>
          {
            Object.keys(AnimationType).map(animation => {
              return (
                <Button
                  key={animation}
                  title={animation.charAt(0).toUpperCase() + animation.substr(1)}
                  onPress={() => {
                    if (Platform.OS === 'android' && animation === AnimationType.keyboard) {
                      alert("Keyboard is not supported on Android")
                    } else {
                      this.setState({animation})
                    }
                  }}
                />
              )
            })
          }
        </View>
        <View style={styles.animatedViewContainer}>
          <Animated.View
            style={[
              styles.animatedView,
              this.state.isViewOnTheLeft ?  {left: 32} : {right: 32},
              {
                height: this.state.scaled ? 60 : 40,
                width: this.state.scaled ? 120 : 80,
                opacity: this.state.faded ? 0.5 : 1
              }
            ]}
          />
        </View>
        <Button
          title={"Animate"}
          onPress={() => {
            LayoutAnimation.configureNext(animationConfigs.get(this.state.animation))

            let newState = {isViewOnTheLeft: !this.state.isViewOnTheLeft}

            // Other special behavior
            switch (this.state.animation) {
              case AnimationType.fade:
                newState.faded = !this.state.faded
                break
              case AnimationType.scaleLinear:
              case AnimationType.scaleSpring:
                newState.scaled = !this.state.scaled
                break
              case AnimationType.keyboard:
                this.hiddenTextInput.isFocused() ? this.hiddenTextInput.blur() : this.hiddenTextInput.focus()
                break
            }

            this.setState(newState)
          }}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100
  },
  currentAnimationText: {
    fontSize: 15,
    textAlign: "center",
    color: "gray",
    marginBottom: 16
  },
  typeButtonContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 60
  },
  animatedViewContainer: {
    width: "100%",
    height: 60,
    marginBottom: 40
  },
  animatedView: {
    backgroundColor: '#E0315E',
    position: "absolute",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  hiddenTextInput: {
    height: 0,
    width: 0,
    position: "absolute"
  }
});
