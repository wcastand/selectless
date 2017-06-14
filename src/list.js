import React from 'react'
import PropTypes from 'prop-types'
import {getContext} from 'recompose'

import omit from 'ramda/src/omit'
import startsWith from 'ramda/src/startsWith'
import compose from 'ramda/src/compose'
import contains from 'ramda/src/contains'
import toUpper from 'ramda/src/toUpper'
import ifElse from 'ramda/src/ifElse'
import filter from 'ramda/src/filter'
import when from 'ramda/src/when'
import prop from 'ramda/src/prop'
import map from 'ramda/src/map'
import tap from 'ramda/src/tap'
import findIndex from 'ramda/src/findIndex'
import equals from 'ramda/src/equals'

import {renderOrCloneComponent} from './utils'

class List extends React.Component {
  state = {currentValue: null}
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyEvent)
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyEvent)
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.opened &&
      nextProps.opened !== this.props.opened &&
      this.state.currentValue === null
    ) {
      if (nextProps.selectedValue.length === 0) this.setState({currentValue: 0})
      else
        this.setState({
          currentValue: findIndex(equals(nextProps.selectedValue[0]), nextProps.options),
        })
    }
    if (!nextProps.opened && nextProps.opened !== this.props.opened)
      this.setState({currentValue: null})
    return true
  }

  handleKeyEvent = e => {
    const {onSelectValue} = this.props
    const {currentValue} = this.state
    switch (e.keyCode) {
      case 13: //ENTER
      case 9: //TAB
        if (currentValue !== null) {
          onSelectValue(this.props.options[currentValue])
          this.setState({currentValue: null})
          e.stopPropagation()
          e.preventDefault()
        }
        break
      case 40: // DOWN
        this.setState({
          currentValue: currentValue !== this.props.options.length - 1 ? currentValue + 1 : 0,
        })
        e.stopPropagation()
        break
      case 38: // UP
        this.setState({
          currentValue: currentValue !== 0 ? currentValue - 1 : this.props.options.length - 1,
        })
        e.stopPropagation()
        break
    }
  }

  renderItems = options => {
    const {caseSensitiveSearch, hasSearch, renderItem, searchValue, selectedValue} = this.props
    const {currentValue} = this.state

    return compose(
      map(o =>
        renderOrCloneComponent(renderItem, {
          key: o.value,
          data: o,
          isSelected: contains(o, selectedValue) || currentValue === findIndex(equals(o), options),
        }),
      ),
      when(
        () => hasSearch,
        ifElse(
          () => caseSensitiveSearch,
          filter(compose(startsWith(searchValue), prop('label'))),
          filter(compose(startsWith(toUpper(searchValue)), toUpper, prop('label'))),
        ),
      ),
    )(options)
  }

  render() {
    const {opened, options, render, ...props} = this.props
    const myprops = omit(
      [
        'renderItem',
        'caseSensitiveSearch',
        'hasSearch',
        'onSelectValue',
        'searchValue',
        'selectedValue',
      ],
      props,
    )
    const items = this.renderItems(options)

    return typeof render === 'undefined'
      ? opened ? <div {...myprops}>{items}</div> : null
      : render({opened, items})
  }
}

const enhance = compose(
  getContext({
    caseSensitiveSearch: PropTypes.bool,
    hasSearch: PropTypes.bool,
    opened: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    searchValue: PropTypes.string,
    selectedValue: PropTypes.array,
    onSelectValue: PropTypes.func,
  }),
)
export default enhance(List)