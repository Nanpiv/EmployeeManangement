import { App as Application } from 'vue'
import router from './router'
import { VueMeteor } from 'vue-meteor-tracker'
import { store, key } from './store'
// Quasar
import { Quasar, AppFullscreen, Notify, Dialog, LoadingBar } from 'quasar'

// Import icon libraries
// import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
// import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'

// Import Quasar css
// import 'quasar/src/css/index.sass'

// UI plugin
import UserIsInRole from '/imports/ui/plugin/userIsInRole'

export default (app: Application) => {
  app.use(router)
  app.use(store, key)
  app.use(VueMeteor)

  app.use(Quasar, {
    plugins: {
      AppFullscreen,
      Notify,
      Dialog,
      LoadingBar,
    },
  })

  // UI plugins
  app.use(UserIsInRole)
}
