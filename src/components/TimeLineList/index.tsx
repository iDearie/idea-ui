import React, { Component } from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import { IBaseProps } from '../base/Props'
import { WithTheme } from '../Theme'
import { styles } from './style'

export interface ITimeLineListProps {
  style?: StyleProp<ViewStyle>
  header?: string
}

export interface ITimeListItemProps extends IBaseProps {
  children?: React.ReactElement | React.ReactNode
  title?: string | React.ReactElement
}

const Item = ({ children, isFirst, isLast, title }: ITimeListItemProps) => (
  <WithTheme themeStyles={styles}>
    {_style => (
      <View style={[_style.item_container]}>
        <View style={[_style.time_line_container]}>
          <View
            style={[
              _style.time_line_line_container,
              isFirst ? _style.time_line_first_line : null,
              isLast ? _style.time_line_last_line : null,
            ]}
          />
          <View style={[_style.time_line_dot_container]}>
            <View style={[_style.time_line_dot_content, isFirst ? _style.time_line_first_dot : null]} />
          </View>
        </View>
        <View style={[_style.item_child_container, isLast ? _style.item_last_child_container : null]}>
          {title ? React.isValidElement(title) ? title : <Text>{title}</Text> : null}
          {children}
        </View>
      </View>
    )}
  </WithTheme>
)

export class TimeLineList extends Component<ITimeLineListProps, any> {
  static Item = Item

  render() {
    const { children, style, header: title } = this.props
    const _children = React.Children.toArray(children)
    return _children.length ? (
      <WithTheme themeStyles={styles}>
        {_style => (
          <View style={[_style.container, style]}>
            {title ? <Text style={[{ paddingTop: 15, fontSize: 14 }]}>{title}</Text> : null}
            {_children.map((child, index) => {
              const isFirst = index === 0
              const isLast = index === _children.length - 1
              return React.cloneElement(child as React.ReactElement, { isFirst, isLast })
            })}
          </View>
        )}
      </WithTheme>
    ) : null
  }
}
