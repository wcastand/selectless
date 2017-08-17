/* global test, expect */

import React from 'react'
import PropTypes from 'prop-types'
import {shallow, mount} from 'enzyme'
import {getContext} from 'recompose'

import {Select} from '../'

test('Select', () => {
  const loadOptions = jest.fn(query =>
    Promise.resolve([
      {label: 'Paris', value: 'paris'},
      {label: 'Tokyo', value: 'tokyo'},
    ])
  )
  const enhance = getContext({
    selectedValue: PropTypes.array,
    opened: PropTypes.bool,
  })
  const Test = props => <span />
  const Rec = enhance(props => <Test {...props} />)
  const tree = mount(
    <Select.Async name="test" loadOptions={loadOptions}>
      <Rec />
    </Select.Async>
  )
  expect(tree.find(Test).props()).toEqual({
    selectedValue: [],
    opened: false,
  })
  expect(loadOptions.mock.calls.length).toBe(1)
})

test('Select error', () => {
  const enhance = getContext({
    selectedValue: PropTypes.array,
    opened: PropTypes.bool,
  })
  const Test = props => <span />
  const Rec = enhance(props => <Test {...props} />)
  const tree = mount(
    <Select.Async
      name="test"
      loadOptions={query =>
        Promise.reject([
          {label: 'Paris', value: 'paris'},
          {label: 'Tokyo', value: 'tokyo'},
        ])}>
      <Rec />
    </Select.Async>
  )
  expect(tree.find(Test).props()).toEqual({selectedValue: [], opened: false})
})

test('Select clearValue', () => {
  const enhance = getContext({
    clearValue: PropTypes.func,
    onSelectValue: PropTypes.func,
    selectedValue: PropTypes.array,
    onChangeSearchValue: PropTypes.func,
    opened: PropTypes.bool,
  })
  const Test = props =>
    <span
      onClick={() => {
        props.onSelectValue({label: 'Paris', value: 'paris'})
        props.onChangeSearchValue('par')
      }}
    />
  const Clear = enhance(props => <label onClick={props.clearValue} />)
  const Rec = enhance(props => <Test {...props} />)
  const tree = mount(
    <Select.Async
      name="test"
      loadOptions={query =>
        Promise.resolve([
          {label: 'Paris', value: 'paris'},
          {label: 'Tokyo', value: 'tokyo'},
        ])}>
      <Rec />
      <Clear />
    </Select.Async>
  )
  tree.find('span').simulate('click')
  expect(tree.find(Test).props()).toEqual(
    expect.objectContaining({
      selectedValue: [{label: 'Paris', value: 'paris'}],
    })
  )
  tree.find('label').simulate('click')
  expect(tree.find(Test).props()).toEqual(
    expect.objectContaining({selectedValue: []})
  )
})

test('Select searchValue', () => {
  const enhance = getContext({
    clearSearchValue: PropTypes.func,
    hasSearch: PropTypes.bool,
    onChangeSearchValue: PropTypes.func,
    searchValue: PropTypes.string,
    toggleSearch: PropTypes.func,
    toggleCaseSensitive: PropTypes.func,
    caseSensitiveSearch: PropTypes.bool,
  })
  const onChangeSearchValue = jest.fn(d => d)
  const Test = props =>
    <span
      onClick={() => {
        props.toggleSearch(false)
        props.toggleSearch()
        props.onChangeSearchValue('par')
        props.onChangeSearchValue('paris')
      }}
    />
  const Toggle = enhance(props =>
    <button
      onClick={() => {
        props.toggleCaseSensitive(false)
        props.toggleCaseSensitive()
      }}
    />
  )
  const Clear = enhance(props => <label onClick={props.clearSearchValue} />)
  const Rec = enhance(props => <Test {...props} />)
  const tree = mount(
    <Select.Async
      name="test"
      loadOptions={query =>
        Promise.resolve([
          {label: 'Paris', value: 'paris'},
          {label: 'Tokyo', value: 'tokyo'},
        ])}
      onChangeSearchValue={onChangeSearchValue}>
      <Rec />
      <Clear />
      <Toggle />
    </Select.Async>
  )
  tree.find('span').simulate('click')
  expect(tree.find(Test).props()).toEqual(
    expect.objectContaining({
      searchValue: 'paris',
    })
  )
  tree.find('button').simulate('click')
  expect(tree.find(Test).props()).toEqual(
    expect.objectContaining({
      caseSensitiveSearch: true,
    })
  )
  tree.find('label').simulate('click')
  expect(tree.find(Test).props()).toEqual(
    expect.objectContaining({
      searchValue: '',
    })
  )
  expect(onChangeSearchValue.mock.calls.length).toBe(2)
})
