<h1 align="center">
  Selectless
  <br>
</h1>
<p align="center" style="font-size: 1.2rem;">Custom Select without predefined UI for React using Context</p>

## Install

```
  yarn add selectless
  npm install selectless
```

## Introduction

There are three different ways to use `selectless`:

- On a component level, `selectless` provides a basic component that you can customize with any css-in-js library or classname/style
- On a custom component level, each component provided by `selectless` accepts a custom `render` prop that allows you to override the default representation/binding of the component
- On a low level controller, `selectless` provides an HOC that lets you pass down the context props of `selectless` as props to your component. This allow a full control on how you want to use `selectless`.

I hope in a near future that me and/or the community can provide pre-styleds for the various css-in-js solutions existing out there.

## Inspiration
This package was inspired by the great `react-select` and the talk from Ryan Florence ["Compound Components"](https://www.youtube.com/watch?v=hEGg-3pIHlE)

## Why we created this package ?

At Kilix, we are working on an app that use a lot of select and right now we use `react-select` for this. But due to old mistake and bad choices in out part,  we now have an old version of `react-select`. So we don't even have the SASS files and therefore have a LESS Loader in our webpack config just for that :/ (we are not proud of it).

Recently we decided to pass to a CSS-IN-JS solution and our choice was [fela](https://github.com/rofrischmann/fela). But integrating third party library isn't the most trivial thing to do with css-in-js and even more with our custom made react-select package. Plus, we really wanted to remove this LESS Loader and that's why we decided to create a select with only the logic and no UI provided, so you can make your own.

Obviously that implies some work on your part (integration at least), but it also allow you a great liberty and once you made your custom select for your app, your good to go and have total control over it ! Big plus, you can use any CSS-IN-JS or CSS you want with React and `selectless`.

So the purpose of this package is not to replace `react-select` in a first place but to provide an alternative compatible with css-in-js libraries that let you have full control over the UI of your select without dealing with the logic behind a select.

In a near futur we hope we(our the community) can provide custom made select UI with `selectless` as module packages for each css-in-js solutions and even SASS, LESS, etc. You can already find some examples in the storybook.

## Basic Usage
```javascript
// src/components/customSelect.js

import React from 'react'
import {Select, Item, Label, List} from 'selectless'

const simpleOptions = [
  {value: 'paris', label: 'Paris'},
  {value: 'newyork', label: 'New-York'},
  {value: 'tokyo', label: 'Tokyo'},
]

const CustomSelect = (props) => (
  <Select name="context" onChange={onChange} options={simpleOptions} {...props}>
    <Label />
    <List renderItem={Item} />
  </Select>
)

export default CustomSelect
```

## Documentation

- [Select / Select.Async](docs/select.md)
- [Predefined Components](docs/sub-components.md)
- [HOC](docs/HOC.md)

## Other Solutions

### [Downshift](https://github.com/paypal/downshift)
There was no real solution for this problem when I started this project, then [Kent C. Dodds](https://github.com/kentcdodds/) released react-autocompletly (now downshift) that uses the same basic principles and try to solve the same problem.
I started working on this a bit earlier but I got lazy and put the project aside.
Anyway, right now his project has far more support so you should consider testing it too. :)

### [React-select](http://jedwatson.github.io/react-select/)
React-select is still really good.

## LICENSE

MIT
