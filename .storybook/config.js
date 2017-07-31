import {configure} from '@storybook/react'
import {setOptions} from '@storybook/addon-options'

setOptions({
  name: 'React Selectless',
  url: 'https://github.com',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
  sortStoriesByKind: false,
})

function loadStories() {
  require('../stories/sync.js')
  require('../stories/async.js')
}

configure(loadStories, module)
