import React, { Component } from 'react'
import {
  TextInputProperties,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  View,
  Text,
} from 'react-native'
import { Omit } from 'utility-types'
import { IWithThemeStyles, Theme, WithTheme } from '../Theme'
import { ITextAreaItemStyles, styles } from './style'
export type TextAreaEventHandle = (val?: string) => void

export type TextInputProps = Omit<TextInputProperties, 'onChange' | 'onFocus' | 'onBlur'>

export interface ITextAreaItemProps extends TextInputProps, IWithThemeStyles<ITextAreaItemStyles> {
  title?: React.ReactNode
  maxLength?: number
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  theme?: 'dark' | 'light'
  clear?: boolean
  rows?: number
  count?: number
  error?: boolean
  autoHeight?: boolean
  editable?: boolean
  disabled?: boolean
  labelNumber?: number
  onChange?: TextAreaEventHandle
  onErrorClick?: () => void
}

export class TextAreaItem extends Component<ITextAreaItemProps, any> {
  static defaultProps = {
    theme: 'dark',
    maxLength: 100,
  }

  constructor(props: ITextAreaItemProps) {
    super(props)
    this.state = {
      inputCount: 0,
    }
  }

  onChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = event.nativeEvent.text
    const { onChange } = this.props
    this.setState({
      inputCount: text.length,
    })
    onChange && onChange(text)
  }

  getHeight = (theme: Theme) => {
    const { rows } = this.props

    if (this.state.height) {
      return this.state.height
    }
    return rows !== undefined && rows > 1 ? 6 * rows * 4 : theme.list_item_height
  }

  render() {
    const { clear, rows, autoHeight, maxLength, style, count, theme, ...restProps } = this.props
    const { inputCount } = this.state
    return (
      <WithTheme themeStyles={styles}>
        {(_style, _theme) => (
          <View style={[_style.container, _style[`${theme}_container`]]}>
            <TextInput
              clearButtonMode={clear ? 'while-editing' : 'never'}
              underlineColorAndroid="transparent"
              {...restProps}
              multiline={rows! > 1 || autoHeight}
              numberOfLines={rows}
              maxLength={maxLength}
              style={[_style.input_item, { height: Math.max(45, this.getHeight(_theme)) }, style]}
              // ref={ref=> this.textAreaRef = ref}
              onChange={event => this.onChange(event)}
            />
            {rows! > 1 && maxLength! > 0 ? (
              <View style={[_style.maxLength]}>
                <Text>
                  {inputCount} / {maxLength}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </WithTheme>
    )
  }
}
