import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Icon } from '../Icon'
import { List } from '../List'
import { WithTheme } from '../Theme'
import { styles } from './style'

interface IPanelProps extends ICollapseProps {
  header: React.ReactElement | string
  value: string
}

class Panel extends Component<IPanelProps> {
  height: number

  state: {
    opened: boolean
  }

  constructor(props: IPanelProps) {
    super(props)
    this.height = 0
    const { activeKeys = [], value } = props
    this.state = {
      opened: activeKeys.includes(value),
    }
  }

  triggerPanel = () => {
    const { onChange, activeKeys = [], value } = this.props
    const { opened } = this.state
    this.setState({
      opened: !opened,
    })
    onChange && onChange(opened ? activeKeys.filter(v => v !== value) : [...activeKeys, value])
  }

  componentWillReceiveProps(nextProps: IPanelProps) {
    const { activeKeys = [], value } = nextProps
    this.setState({
      opened: activeKeys.includes(value),
    })
  }

  render() {
    const { children, header } = this.props
    const { opened } = this.state
    return (
      <WithTheme themeStyles={styles}>
        {_style => (
          <View style={opened ? _style.container : null}>
            {header ? (
              <View style={[_style.header_container]}>
                <List.Item
                  showArrow={false}
                  borderBottom={0}
                  separate={1}
                  activeOpacity={1}
                  onPress={this.triggerPanel}
                  label={React.isValidElement(header) ? header : <Text>{header}</Text>}
                >
                  <Icon
                    name={'chevron-down'}
                    style={[_style.icon, { transform: [{ rotate: opened ? '180deg' : '0deg' }] }]}
                  />
                </List.Item>
              </View>
            ) : null}
            <View style={[{ height: opened ? 'auto' : 0 }, _style.panel_child_view]}>{children}</View>
          </View>
        )}
      </WithTheme>
    )
  }
}

interface ICollapseProps {
  activeKeys?: string[]
  onChange?: (activeKeys: string[]) => void
}

export class Collapse extends Component<ICollapseProps> {
  static Panel = Panel
  render() {
    const { children, activeKeys } = this.props
    return React.Children.map(children, child => {
      return React.cloneElement(child as React.ReactElement, { activeKeys, onChange: this.props.onChange })
    })
  }
}
