import Notify from '../lib/notify'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useStore } from '/imports/store'

export default () => {
  const router = useRouter()
  const store = useStore()

  const loading = ref(false)

  const login = ({ username, password }, inputRef) => {
    loading.value = true
    Meteor.loginWithPassword(username, password, (err) => {
      if (err) {
        Notify.error({ message: 'Username or password is incorrect' })
        inputRef.focus()
        closeLoading()
      } else {
        store.dispatch('app/setCurrentUser', Meteor.user())
        router.push({ name: 'Dashboard' })
        closeLoading()
      }
    })
  }

  const logout = () => {
    Meteor.logout((err) => {
      if (err) {
        Notify.error({ message: err.reason || err })
      } else {
        store.dispatch('app/logout')
        router.push('/login')
      }
    })
  }

  const closeLoading = () => {
    setTimeout(() => {
      loading.value = false
    }, 300)
  }

  return { loading, logout, login }
}
