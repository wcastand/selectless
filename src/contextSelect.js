import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withContext} from 'recompose'

import filter from 'ramda/src/filter'
import map from 'ramda/src/map'
import compose from 'ramda/src/compose'
import when from 'ramda/src/when'
import ifElse from 'ramda/src/ifElse'
import startsWith from 'ramda/src/startsWith'
import toUpper from 'ramda/src/toUpper'
import symmetricDifference from 'ramda/src/symmetricDifference'
import prop from 'ramda/src/prop'
import tap from 'ramda/src/tap'
import pick from 'ramda/src/pick'
import R from 'ramda'
import {renderOrCloneComponent} from './utils'

class ContextSelect extends React.Component {
  state = {
    caseSensitiveSearch: false,
    hasSearch: false,
    opened: false,
    options: [],
    searchValue: '',
    selectedValue: [],
  }
  componentWillMount() {
    this.setState({
      options: map(this.transform, this.props.options),
      selectedValue: typeof this.props.defaultValue !== 'undefined'
        ? [this.transform(this.props.defaultValue)]
        : [],
    })
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.selectedValue !== this.state.selectedValue)
      this.props.onChange(nextState.selectedValue)
  }

  getChildContext() {
    const {defaultValue, name, multi, placeholder, transform} = this.props
    const {caseSensitiveSearch, hasSearch, opened, options, searchValue, selectedValue} = this.state
    return {
      caseSensitiveSearch,
      defaultValue,
      hasSearch,
      name,
      multi,
      placeholder,
      transform: this.transform,
      toggleCaseSensitive: this.toggleCaseSensitive,
      toggleSearch: this.toggleSearch,
      toggleSelect: this.toggleSelect,
      onSelectValue: this.onSelectValue,
      clearValue: this.clearValue,
      clearOneValue: this.clearOneValue,
      clearSearchValue: this.clearSearchValue,
      onChangeSearchValue: this.onChangeSearchValue,
      opened,
      options,
      searchValue,
      selectedValue,
    }
  }

  transform = data =>
    typeof this.props.transform !== 'undefined' ? this.props.transform(data) : data

  toggleSearch = (active = null) =>
    this.setState({hasSearch: active !== null ? active : !this.state.hasSearch})

  toggleCaseSensitive = (active = null) =>
    this.setState({caseSensitiveSearch: active !== null ? active : !this.state.caseSensitiveSearch})

  toggleSelect = (opened = null) =>
    this.setState({opened: opened !== null ? opened : !this.state.opened})

  onSelectValue = data => {
    this.props.clearSearchValue && this.props.clearSearchValue()
    this.setState({
      opened: false,
      selectedValue: this.props.multi
        ? symmetricDifference(this.state.selectedValue, [this.transform(data)])
        : [this.transform(data)],
    })
  }

  clearValue = e => {
    this.setState({selectedValue: []})
    e.stopPropagation()
  }

  clearOneValue = t => {
    this.setState({
      selectedValue: filter(v => v.value !== t.value, this.state.selectedValue),
    })
  }

  clearSearchValue = () => this.setState({searchValue: ''})
  onChangeSearchValue = query => this.setState({searchValue: query})

  renderInputs = () => {
    return map(
      v =>
        <input
          key={v.label}
          name={`${this.props.name}[${v.label}]`}
          type="hidden"
          value={v.value}
        />,
      this.state.selectedValue,
    )
  }
  render() {
    const containerProps = pick(['classname', 'style'], this.props)
    return (
      <div {...containerProps}>
        {this.renderInputs()}
        {this.props.children}
      </div>
    )
  }
}

ContextSelect.propTypes = {
  classname: PropTypes.string,
  defaultValue: PropTypes.any,
  name: PropTypes.string.isRequired,
  multi: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  transform: PropTypes.func,
}

ContextSelect.defaultProps = {
  multi: false,
  placeholder: 'Select an options',
}
ContextSelect.childContextTypes = {
  caseSensitiveSearch: PropTypes.bool.isRequired,
  clearValue: PropTypes.func.isRequired,
  clearOneValue: PropTypes.func.isRequired,
  clearSearchValue: PropTypes.func.isRequired,
  defaultValue: PropTypes.any,
  hasSearch: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  multi: PropTypes.bool,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  onSelectValue: PropTypes.func.isRequired,
  onChangeSearchValue: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired,
  selectedValue: PropTypes.array.isRequired,
  searchValue: PropTypes.string.isRequired,

  transform: PropTypes.func,
  toggleCaseSensitive: PropTypes.func.isRequired,
  toggleSearch: PropTypes.func.isRequired,
  toggleSelect: PropTypes.func.isRequired,
}

export default ContextSelect
