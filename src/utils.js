import React from 'react'
import { findDOMNode } from 'react-dom'
import add from 'ramda/src/add'
import subtract from 'ramda/src/subtract'
import findIndex from 'ramda/src/findIndex'
import equals from 'ramda/src/equals'
import __ from 'ramda/src/__'

export function renderOrCloneComponent (BaseComponent, props, children) {
  if (React.isValidElement(BaseComponent)) {
    return React.cloneElement(BaseComponent, props, children)
  }
  return React.createElement(BaseComponent, props, children)
}

export const closestAvailable = (currentValue, optionsLength, fn) => {
  if (fn(currentValue) > currentValue) {
    if (currentValue < optionsLength - 1) return fn(currentValue)
    else return 0
  } else {
    if (currentValue !== 0) return fn(currentValue)
    else return optionsLength - 1
  }
}

export function withKeyboardEvent (BaseComponent) {
  return class WithKeyboardEvent extends React.Component {
    state = { currentValue: null }
    componentDidMount () {
      document.addEventListener('keydown', this.handleKeyEvent)
    }
    componentWillUnmount () {
      this.setRef(null)
      document.removeEventListener('keydown', this.handleKeyEvent)
    }
    componentWillReceiveProps (nextProps) {
      if (
        (nextProps.opened &&
          nextProps.opened !== this.props.opened &&
          this.state.currentValue === null) ||
        nextProps.searchValue !== this.props.searchValue
      ) {
        if (nextProps.selectedValue.length === 0) {
          this.setState({ currentValue: 0 })
        } else {
          this.setState({
            currentValue: findIndex(
              equals(nextProps.selectedValue[0]),
              this.props.options
            )
          })
        }
      }
      if (!nextProps.opened && nextProps.opened !== this.props.opened) {
        this.setState({ currentValue: null })
      }
    }
    componentDidUpdate (nextProps, nextState) {
      const { currentValue } = this.state
      if (
        nextProps.opened &&
        nextState.currentValue !== currentValue &&
        this.list !== null
      ) {
        const wrapper = findDOMNode(this.list)
        if (wrapper !== null) {
          const item =
            typeof item === 'undefined'
              ? wrapper.firstChild
              : findDOMNode(this.item)
          if (item !== null) {
            const wrapperHeight = wrapper.getBoundingClientRect().height
            const itemHeight = item.getBoundingClientRect().height
            const ratio = wrapperHeight / itemHeight
            const offset = itemHeight * currentValue
            if (
              offset < wrapper.scrollTop ||
              offset >
                wrapper.scrollTop +
                  currentValue % Math.floor(ratio) * itemHeight
            ) {
              wrapper.scrollTop = currentValue * itemHeight
            }
          }
        }
      }
    }
    setRef = ref => (this.list = ref)
    handleKeyEvent = e => {
      const {
        onSelectValue,
        toggleSelect,
        toggleSearch,
        opened,
        options
      } = this.props
      const { currentValue } = this.state
      if (opened) {
        switch (e.keyCode) {
          case 13: // ENTER
          case 9: // TAB
            if (currentValue !== null) {
              onSelectValue(this.props.options[currentValue])
              toggleSelect(false)
              toggleSearch(false)
              this.setState({ currentValue: null })
              e.stopPropagation()
              e.preventDefault()
            }
            break
          case 40: // DOWN
            this.setState({
              currentValue: closestAvailable(
                currentValue,
                options.length,
                add(__, 1)
              )
            })
            e.stopPropagation()
            break
          case 38: // UP
            this.setState({
              currentValue: closestAvailable(
                currentValue,
                options.length,
                subtract(__, 1)
              )
            })
            e.stopPropagation()
            break
        }
      }
    }
    render () {
      return renderOrCloneComponent(BaseComponent, {
        currentValue: this.state.currentValue,
        setRef: this.setRef,
        ...this.props
      })
    }
  }
}
