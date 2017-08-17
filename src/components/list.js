import React from 'react'
import {compose} from 'recompose'

import controller from '../controller'
import {renderOrCloneComponent, withKeyboardEvent} from '../utils'

class List extends React.Component {
  render() {
    const {
      currentValue,
      opened,
      render,
      renderItem,
      caseSensitiveSearch,
      clearSearchValue,
      hasSearch,
      onSelectValue,
      toggleSelect,
      toggleSearch,
      searchValue,
      selectedValue,
      setRef,
      options,
      passThrough,
      ...props
    } = this.props

    const items = options.map((o, idx) => {
      const isCurrent = currentValue === options.indexOf(o)
      return renderOrCloneComponent(renderItem, {
        key: idx,
        data: o,
        isCurrent,
        isSelected: selectedValue.indexOf(o) !== -1,
        passThrough: ['data', 'isCurrent', 'isSelected'],
      })
    })

    return typeof render === 'undefined'
      ? opened
        ? <div {...props} role="listbox" ref={ref => setRef(ref)}>
            {items}
          </div>
        : null
      : render({opened, items, setRef})
  }
}

const enhance = compose(
  controller([
    'caseSensitiveSearch',
    'hasSearch',
    'opened',
    'options',
    'searchValue',
    'toggleSelect',
    'toggleSearch',
    'selectedValue',
    'onSelectValue',
  ]),
  withKeyboardEvent
)
export default enhance(List)
