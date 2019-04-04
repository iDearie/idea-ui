import React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { WithTheme } from '../Theme'
import { IPopoverStyles, styles } from './style'

interface IPopoverProps {
  direction?: 'top' | 'bottom' | 'left' | 'right'
  gap?: number
  isVisible?: boolean
  customView?: React.ReactElement | null | undefined
  message?: string
}

interface IDirObject {
  setPosition: (
    object: {
      customWidth: number
      customHeight: number
      childWidth: number
      childHeight: number
      gap: number
    },
  ) => void
  borderStyle: StyleProp<ViewStyle>
}

export class Popover extends React.Component<IPopoverProps> {
  static defaultProps = {
    direction: 'top',
    gap: 2,
  }

  dirObject: IDirObject

  viewRef: any

  childrenRef: any

  customViewRef: any

  dirEnum: { [key: string]: (style: IPopoverStyles) => IDirObject } = {
    top: style => {
      return {
        setPosition: ({ customWidth, customHeight, childWidth, gap }) => {
          this.viewRef.setNativeProps({
            top: -(gap + customHeight + 4),
            left: (childWidth - customWidth) / 2,
          })
        },
        borderStyle: style.topTriangle,
      }
    },
    bottom: style => {
      return {
        setPosition: ({ customWidth, customHeight, childWidth, gap }) => {
          this.viewRef.setNativeProps({
            bottom: -(gap + customHeight + 4),
            left: (childWidth - customWidth) / 2,
          })
        },
        borderStyle: style.bottomTriangle,
      }
    },
    left: style => {
      return {
        setPosition: ({ customWidth, customHeight, childHeight, gap }) => {
          this.viewRef.setNativeProps({
            top: (childHeight - customHeight) / 2,
            left: -(customWidth + gap + 4),
          })
        },
        borderStyle: style.leftTriangle,
      }
    },
    right: style => {
      return {
        setPosition: ({ customWidth, customHeight, childHeight, gap }) => {
          this.viewRef.setNativeProps({
            top: (childHeight - customHeight) / 2,
            right: -(customWidth + gap + 4),
          })
        },
        borderStyle: style.rightTriangle,
      }
    },
  }

  constructor(props: IPopoverProps) {
    super(props)
    this.dirObject = {
      setPosition: () => {},
      borderStyle: {},
    }
  }

  layout = (style: IPopoverStyles) => {
    const { direction = Popover.defaultProps.direction, gap = Popover.defaultProps.gap } = this.props
    this.dirObject = this.dirEnum[direction](style)
    this.childrenRef.measure((_ox: number, _oy: number, childWidth: number, childHeight: number) => {
      this.customViewRef.measure((_ox: number, _oy: number, customWidth: number, customHeight: number) => {
        this.dirObject.setPosition({
          customWidth,
          customHeight,
          childWidth,
          childHeight,
          gap,
        })
      })
    })
  }

  render() {
    const { isVisible, message } = this.props
    return (
      <WithTheme themeStyles={styles}>
        {style => (
          <View style={style.style_popover_container}>
            {isVisible ? (
              <View
                style={[style.style_popover_wrap]}
                onLayout={() => this.layout(style)}
                ref={(ref: any) => (this.viewRef = ref)}
              >
                <View ref={(ref: any) => (this.customViewRef = ref)} style={[style.style_popover_content]}>
                  <Text style={[style.style_popover_content_text]}>{message}</Text>
                </View>
                <View style={[style.triangle_container]}>
                  <View style={[this.dirObject.borderStyle]} />
                </View>
              </View>
            ) : null}
            {React.cloneElement(this.props.children as React.ReactElement, {
              ref: (ref: any) => (this.childrenRef = ref),
            })}
          </View>
        )}
      </WithTheme>
    )
  }
}
