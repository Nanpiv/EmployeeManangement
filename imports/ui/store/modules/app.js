import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'

// State
export default {
  namespaced: true,
  state: {
    lang: 'en',
    isLogged: Meteor.userId() !== null,
    userId: null,
    currentUser: Meteor.user() || Session.get('currentUser'),
    allowedBranches: Session.get('allowedBranches') || [],
    currentBranch: Session.get('currentBranch'),
  },
  // Getters
  getters: {
    userFullName(state) {
      return state.currentUser ? state.currentUser.profile.fullName : 'Unknown'
    },
    currentBranchId(state) {
      return state.currentBranch ? state.currentBranch._id : null
    },
  },
  // Mutations
  mutations: {
    UPDATE_LANG(state, value) {
      state.lang = value
    },
    SET_IS_LOGGED(state, val) {
      state.isLogged = val
    },
    SET_USER_ID(state, val) {
      state.userId = val
    },
    SET_CURRENT_USER(state, val) {
      Session.setAuth('currentUser', val)
      state.currentUser = val
    },
    UPDATE_ALLOWED_BRANCHES(state, value) {
      Session.setAuth('allowedBranches', value)
      state.allowedBranches = value
    },
    UPDATE_CURRENT_BRANCH(state, value) {
      Session.setAuth('currentBranch', value)
      state.currentBranch = value
    },
    LOGOUT(state) {
      Session.clearAuth()
      state.currentUser = null
      localStorage.removeItem('vuex')
    },
  },
  // Actions
  actions: {
    updateLang({ commit }, value) {
      value = value || 'en'
      commit('UPDATE_LANG', value)
    },
    UPDATE_LANG(state, value) {
      state.lang = value
    },
    setIsLogged({ commit }, val) {
      commit('SET_IS_LOGGED', val)
    },
    setUserId({ commit }, val) {
      commit('SET_USER_ID', val)
    },
    setCurrentUser({ commit }, val) {
      commit('SET_CURRENT_USER', val)
    },
    loadCurrentUser({ commit }) {
      // See https://forums.meteor.com/t/meteor-userid-returns-an-id-but-meteor-user-returns-undefined/18355/5

      //! Meteor.user() will not be ready right away,
      //! it is reactive so we need to wait for it
      Tracker.autorun(() => {
        if (Meteor.user()) {
          commit('SET_CURRENT_USER', Meteor.user())
        }
      })
    },
    updateAllowedBranches({ commit }, branches) {
      commit('UPDATE_ALLOWED_BRANCHES', branches)
      commit(
        'UPDATE_CURRENT_BRANCH',
        branches && branches.length ? branches[0] : Session.get('currentBranch')
      )
    },
    updateCurrentBranch({ commit }, val) {
      commit('UPDATE_CURRENT_BRANCH', val)
    },
    logout({ commit }) {
      commit('LOGOUT')
    },
  },
}
