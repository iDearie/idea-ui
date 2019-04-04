import React from 'react'
import { Image, PanResponder, StyleProp, View, ViewStyle } from 'react-native'
import { Popover } from '../Popover'
import { WithTheme } from '../Theme'
import { styles } from './style'

interface ISliderWrapProps {
  onDrag?: (object: any) => void
  message?: string
  style?: StyleProp<ViewStyle>
  refs?: any
  showPopover?: boolean
}

export class SliderWrap extends React.Component<ISliderWrapProps> {
  state = {
    isVisible: false,
  }
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_evt, _gestureState) => true,
    onStartShouldSetPanResponderCapture: (_evt, _gestureState) => true,
    onMoveShouldSetPanResponder: (_evt, _gestureState) => true,
    onMoveShouldSetPanResponderCapture: (_evt, _gestureState) => true,
    onPanResponderMove: ({ nativeEvent }, gestureState) => {
      const { onDrag } = this.props
      onDrag && onDrag({ gestureState, nativeEvent })
    },
  })

  render() {
    const { message = '应届', style, refs, showPopover } = this.props
    return (
      <WithTheme themeStyles={styles}>
        {_style => (
          <View ref={refs} style={[_style.style_slider_wrap_view, style]} {...this.panResponder.panHandlers}>
            <Popover isVisible={showPopover} message={message}>
              <Image
                style={[_style.style_slider_wrap_view]}
                source={require('./images/slider_wrap.png')}
                resizeMode={'contain'}
              />
            </Popover>
          </View>
        )}
      </WithTheme>
    )
  }
}
