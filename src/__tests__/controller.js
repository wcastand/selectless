import React from 'react'
import renderer from 'react-test-renderer'

import {Select} from '../'
import controller from '../controller'

test('should return all context', () => {
  const enhance = controller()
  const Test = props => (
    expect(Object.keys(props)).toEqual([
      'caseSensitiveSearch',
      'clearSearchValue',
      'hasSearch',
      'onChangeSearchValue',
      'searchValue',
      'options',
      'sourceOptions',
      'toggleCaseSensitive',
      'toggleSearch',
      'transform',
      'clearValue',
      'clearOneValue',
      'defaultValue',
      'name',
      'multi',
      'placeholder',
      'onSelectValue',
      'opened',
      'selectedValue',
      'toggleSelect',
    ]),
    <div />
  )
  const STest = enhance(Test)
  const component = renderer.create(
    <Select name="test" options={[{value: 0, label: 'Test'}]}><STest /></Select>,
  )
})

test('should pass only selected props', () => {
  const enhance = controller(['name', 'opened'])
  const Test = props => (expect(Object.keys(props)).toEqual(['name', 'opened']), <div />)
  const STest = enhance(Test)
  const component = renderer.create(
    <Select name="test" options={[{value: 0, label: 'Test'}]}><STest /></Select>,
  )
})