import { Meteor } from 'meteor/meteor'
import { createApp, h, App as Application } from 'vue'

globalThis.__VUE_OPTIONS_API__ = true
globalThis.__VUE_PROD_DEVTOOLS__ = false

import plugin from './plugin'
import AppLayout from './AppLayout.vue'

Meteor.startup(() => {
  const app: Application = createApp({
    render() {
      return h(AppLayout)
    },
  })
  plugin(app)

  app.mount('#app')
})