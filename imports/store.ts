import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { InjectionKey } from 'vue'

// Modules
import app from '/imports/ui/store'

export type State = { app: any }

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  modules: {
    app,
  },
})

export const useStore = () => {
  return baseUseStore(key)
}
