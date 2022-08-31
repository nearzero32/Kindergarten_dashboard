<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <!-- <v-img
            :src="appLogo"
            max-height="30px"
            max-width="30px"
            alt="logo"
            contain
            class="me-3 "
          ></v-img> -->

          <h2 class="text-2xl font-weight-semibold">
            المدرسة الالكترونية
          </h2>
        </v-card-title>

        <!-- login form -->
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="inputs.email"
              outlined
              label="الايميل"
              placeholder="john@example.com"
              hide-details
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="inputs.password"
              outlined
              :type="isPasswordVisible ? 'text' : 'password'"
              label="الرمز"
              placeholder="············"
              :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
              hide-details
              @click:append="isPasswordVisible = !isPasswordVisible"
            ></v-text-field>

            <v-btn
              block
              color="primary"
              class="mt-6"
              :loading="this.$store.state.btnLoginLoading"
              @click="login"
            >
              تسجيل الدخول
            </v-btn>
          </v-form>
          <div class="text-center mt-4">
            <v-alert
              v-if="showDeniedNotificationError"
              type="error"
              color="#ff416c"
            >
              يجب السماح للاشعارات لتسجيل الدخول
            </v-alert>
            <v-alert
              v-if="this.$store.state.errorMessageShow"
              type="error"
              color="#ff416c"
            >
              هنالك خطأ في الايميل او الباسورد
            </v-alert>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- background triangle shape  -->
    <img
      class="auth-mask-bg"
      height="173"
      :src="require(`@/assets/images/misc/mask-${$vuetify.theme.dark ? 'dark':'light'}.png`)"
    >

    <!-- tree -->
    <v-img
      class="auth-tree"
      width="247"
      height="185"
      src="@/assets/images/misc/tree.png"
    ></v-img>

    <!-- tree  -->
    <v-img
      class="auth-tree-3"
      width="377"
      height="289"
      src="@/assets/images/misc/tree-3.png"
    ></v-img>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import themeConfig from '@themeConfig'

export default {
  data() {
    return {
      inputs: {
        email: '',
        password: '',
      },

      // themeConfig
      appName: themeConfig.app.name,
      appLogo: themeConfig.app.logo,
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
      isPasswordVisible: false,
      firebaseToken: null,
      userInfo: {},
      showDeniedNotificationError: false,
    }
  },

  methods: {
    async login() {
      // if (!this.firebaseToken) {
      //   this.showDeniedNotificationError = true
      // } else {
      //   this.showDeniedNotificationError = false
      this.$store.dispatch('changeLoginBtnToTrue')

      await this.getUserInfo()

      this.$store.dispatch('submitLogin', {
        email: this.inputs.email,
        password: this.inputs.password,
        userInfo: this.userInfo,

        // firebaseToken: this.firebaseToken,
      })
    },
    reRender() {
      this.$forceUpdate()
    },
    async getUserInfo() {
      this.axios
        .get('http://ip-api.com/json')
        .then(Response => {
          this.userInfo = Response.data
        })
        .catch(error => {
          console.log('error', error)
        })
    },
  },
}
</script>

<style lang="scss">
@import '@core/preset/preset/pages/auth.scss';
</style>
