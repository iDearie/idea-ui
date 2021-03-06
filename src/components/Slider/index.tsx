import React from 'react'
import { Dimensions, StyleProp, View, ViewStyle } from 'react-native'
import { WithTheme } from '../Theme'
import { SliderWrap } from './SliderWrap'
import { sliderWrapWidth, styles } from './style'
import { IBaseProps } from '../base/Props'

const { width: windowWidth } = Dimensions.get('window')

interface ISliderProps extends IBaseProps {
  max?: number // 最大值
  showLeft?: boolean // 是否展示左侧滑块
  showPopover?: boolean // 是否展示Popover
  startMessage?: string // 左侧滑块Popover内容
  endMessage?: string // 右侧滑块Popover内容
  style?: StyleProp<ViewStyle> // 根节点样式
  onChange?: (object: { start: number; end: number }) => void // onChange回调方法
  start?: number
  end?: number
}

const defaultProps: ISliderProps = {
  max: 100,
  showLeft: false,
  showPopover: true,
}

export class Slider extends React.Component<ISliderProps> {
  static defaultProps = defaultProps

  startWrap: any
  endWrap: any
  lineWrap: any

  componentWidth: number
  paddingRight: number
  paddingLeft: number
  scaleWidth: number

  state: {
    left: number
    right: number
    start: number
    end: number
  }

  constructor(props: ISliderProps) {
    super(props)
    const { max = defaultProps.max } = props
    this.state = {
      left: 0,
      right: 0,
      start: 0,
      end: max || 0,
    }
    this.componentWidth = 0
    this.paddingRight = 0
    this.paddingLeft = 0
    this.scaleWidth = 0
  }

  onLayout = ({ nativeEvent: { layout } }: any) => {
    const { max = 100, showLeft } = this.props
    const { width } = layout
    this.componentWidth = width
    this.paddingRight = this.paddingLeft = (windowWidth - width) / 2
    this.scaleWidth = (width - (!showLeft ? sliderWrapWidth : sliderWrapWidth * 2)) / max
    this.resizePosition(this.props)
  }

  resizePosition = (props: ISliderProps) => {
    const { max = 0, showLeft } = this.props
    const { start = this.state.start, end = this.state.end } = props
    const left = showLeft ? start * this.scaleWidth : 0
    const right = (max - end) * this.scaleWidth
    this.startWrap.setNativeProps({
      style: { left },
    })
    this.endWrap.setNativeProps({
      style: { right },
    })
    this.lineWrap.setNativeProps({
      style: { left: showLeft ? left + sliderWrapWidth : 0, right: right + sliderWrapWidth },
    })
    this.setState({
      start,
      left,
      right,
      end,
    })
  }

  onDragStart = ({ nativeEvent }: any) => {
    const { right: stateRight } = this.state
    const left = nativeEvent.pageX - this.paddingLeft
    const total = left + stateRight + sliderWrapWidth * 2
    if (left < 0) {
      return
    }
    if (total >= this.componentWidth) {
      return
    }
    const start = Math.round(left / this.scaleWidth)
    this.setState({
      left,
      start,
    })
    this.startWrap.setNativeProps({
      style: { left },
    })
    this.lineWrap.setNativeProps({
      style: { left: left + sliderWrapWidth },
    })
    this.onChange({ start, end: this.state.end })
  }

  onDragEnd = ({ nativeEvent }: any) => {
    const { left: stateLeft } = this.state
    const { showLeft } = this.props
    const right = windowWidth - nativeEvent.pageX - this.paddingRight
    const _sliderWrapWidth = !showLeft ? sliderWrapWidth : sliderWrapWidth * 2
    const total = stateLeft + right + _sliderWrapWidth
    if (right < 0) {
      return
    }
    if (total >= this.componentWidth) {
      return
    }
    const end = Math.round((nativeEvent.pageX - this.paddingRight - _sliderWrapWidth) / this.scaleWidth)
    this.setState({
      right,
      end,
    })
    this.endWrap.setNativeProps({
      style: { right },
    })
    this.lineWrap.setNativeProps({
      style: { right: right + sliderWrapWidth },
    })
    this.onChange({ start: this.state.start, end })
  }

  onChange = ({ start, end }: { start: number; end: number }) => {
    const { onChange } = this.props
    if (onChange) {
      onChange({ start, end })
    }
  }
  render() {
    const { showLeft, showPopover, startMessage = '', endMessage = '', style } = this.props
    const { start, end } = this.state
    return (
      <WithTheme themeStyles={styles}>
        {_style => (
          <View style={[_style.style_slider_container_view, style]} onLayout={this.onLayout}>
            {showLeft ? (
              <SliderWrap
                showPopover={showPopover}
                message={startMessage || `${start}`}
                refs={(ref: any) => (this.startWrap = ref)}
                onDrag={this.onDragStart}
              />
            ) : null}
            <View style={[_style.style_slider_line_container]}>
              <View style={[_style.style_slider_line_active]} ref={(ref: any) => (this.lineWrap = ref)} />
            </View>
            <SliderWrap
              showPopover={showPopover}
              message={endMessage || `${end}`}
              refs={(ref: any) => (this.endWrap = ref)}
              onDrag={this.onDragEnd}
            />
          </View>
        )}
      </WithTheme>
    )
  }
}
