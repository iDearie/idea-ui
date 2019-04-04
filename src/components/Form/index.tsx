import * as React from 'react'
import { Text, View, ViewStyle, TextStyle, StyleProp } from 'react-native'
import { createForm } from 'rc-form'
import { styles } from './styles'
import { List, IListItemProps } from '../List'
import { IBaseProps } from '../base/Props'
const { Item: ListItem } = List

interface IFormItemProps extends IListItemProps, IBaseProps {
  viewStyle: StyleProp<ViewStyle> // Item 根节点样式
  labelStyle: StyleProp<TextStyle> // Item label节点样式
  extendStyle: StyleProp<ViewStyle> // Item 扩展组件样式
  onPress: () => void
  children: any // Item 点击方法
}

interface IFormProps {
  style: StyleProp<ViewStyle> // 根节点样式
}

class FormItem extends React.PureComponent<IFormItemProps> {
  getError = (error: any) => {
    if (error) {
      return error.map((info: any) => {
        return (
          <Text style={styles.error_text} key={info}>
            {info}
          </Text>
        )
      })
    }
    return null
  }

  renderChild = (props: IFormItemProps) => {
    const { children, extendStyle, ...otherProps } = props
    const isString = typeof children === 'string'
    return (
      <View style={[styles.style_list_item_container, !isString ? extendStyle : null]}>
        {React.Children.map(
          !isString ? (
            children
          ) : (
            <Text numberOfLines={1} style={[styles.style_extend_text, extendStyle]}>
              {children}
            </Text>
          ),
          child => {
            return React.cloneElement(child as React.ReactElement<any>, {
              ...otherProps,
            })
          },
        )}
      </View>
    )
  }
  render() {
    const {
      viewStyle,
      label,
      labelStyle,
      extendStyle,
      onPress,
      separate = 0,
      borderBottom = 0.5,
      activeOpacity,
      showArrow,
      disabled = false,
      touchable = true,
    } = this.props

    return (
      <List>
        <ListItem
          touchable={touchable}
          disabled={disabled}
          borderBottom={borderBottom}
          separate={separate}
          onPress={onPress}
          label={label}
          viewStyle={viewStyle}
          labelStyle={labelStyle}
          extendStyle={extendStyle}
          activeOpacity={activeOpacity}
          showArrow={showArrow}
        >
          {this.renderChild(this.props)}
        </ListItem>
      </List>
    )
  }
}

export default class Form extends React.Component<IFormProps> {
  static FormItem = FormItem
  static create = createForm
  render() {
    const { children, style } = this.props
    return <View style={style}>{children}</View>
  }
}
