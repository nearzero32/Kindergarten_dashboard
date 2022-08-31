import appConfigStoreModule from '@core/@app-config/appConfigStoreModule'
import Vue from 'vue'
import Vuex from 'vuex'
import Api from '../api/api'
import router from '../router/index'
import app from './app'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        accessToken: null,
        firebaseToken: null,
        results: null,
        study_year: null,
        errorMessageShow: false,
        btnLoginLoading: false,

        FileUrl: 'https://testapi.qalam-iq.com/api/web/',

        // FileUrl: 'http://localhost:3400/',
    },
    mutations: {
        authUser(state, userData) {
            state.accessToken = userData.accessToken
            state.firebaseToken = userData.firebaseToken
            state.results = userData.results
            state.study_year = userData.study_year
            state.errorMessageShow = false
            state.btnLoginLoading = false
        },
        clearAuthUser(state) {
            state.accessToken = null
            state.results = null
            state.btnLoginLoading = false
        },
        errorLogin(state) {
            state.errorMessageShow = true
            state.btnLoginLoading = false
        },
        changeLoginBtnToTruefunction(state) {
            state.btnLoginLoading = true
        },
    },
    actions: {
        async submitLogin({ commit, dispatch }, authData) {
            let response = await Api.login(
                authData.email,
                authData.password,
                navigator.appVersion,
                authData.userInfo.query,
                authData.userInfo.city,
                authData.userInfo.lat,
                authData.userInfo.lat,
            )

            if (
                response.error === false &&
                response.results.data.error === false &&
                (response.results.data.results.account_type === 'manager' ||
                    response.results.data.results.account_type === 'assistance' ||
                    response.results.data.results.account_type === 'admin')
            ) {
                commit('authUser', {
                    accessToken: response.results.data.results.token,
                    firebaseToken: authData.firebaseToken,
                    results: response.results.data.results,
                    study_year: response.results.data.study_year,
                })
                localStorage.setItem('accessToken', response.results.data.results.token)
                localStorage.setItem('firebaseToken', authData.firebaseToken)
                localStorage.setItem('results', JSON.stringify(response.results.data.results))
                localStorage.setItem('study_year', JSON.stringify(response.results.data.study_year))

                // check account type
                if (response.results.data.results.account_type === 'admin') {
                    router.push('/adminHome').catch(err => {
                        console.log(err)
                    })
                } else {
                    router.push('/home').catch(err => {
                        console.log(err)
                    })
                }
            } else {
                commit('errorLogin')
            }
        },

        tryLoginAuth({ commit }) {
            const accessToken = localStorage.getItem('accessToken')
            const results = localStorage.getItem('results')
            if (!accessToken) {
                return
            }
            commit('authUser', {
                accessToken,
                results,
            })
        },
        submitLogout({ commit }) {
            commit('clearAuthUser')
            localStorage.clear('accessToken')
            localStorage.clear('results')
            localStorage.setItem('reloaded', 'false')
            router.replace('/')
        },
        setLogoutTimer({ commit }, expireIN) {
            setTimeout(() => {
                commit('clearAuthUser')
                localStorage.clear('accessToken')
                localStorage.clear('results')
                localStorage.setItem('reloaded', 'false')
                router.replace('/')
            }, expireIN)
        },
        changeLoginBtnToTrue({ commit }) {
            commit('changeLoginBtnToTruefunction')
        },
    },
    modules: {
        appConfig: appConfigStoreModule,
        app,
    },
})