<template>
  <div>
    <v-menu offset-y left nudge-bottom="14" min-width="230" content-class="user-profile-menu-content">
      <template v-slot:activator="{ on, attrs }">
        <v-badge bottom color="success" overlap offset-x="12" offset-y="12" class="ms-4" dot>
          <v-avatar size="40px" v-bind="attrs" color="primary" class="v-avatar-light-bg primary--text" v-on="on">
            <v-img v-if="schoolLogo" :src="content_url + schoolLogo"></v-img>
            <v-img v-else :src="require('@/assets/images/avatars/1.png')"></v-img>
          </v-avatar>
        </v-badge>
      </template>
      <v-list>
        <div class="pb-3 pt-2">
          <v-badge bottom color="success" overlap offset-x="12" offset-y="12" class="ms-4" dot>
            <v-avatar size="40px" color="primary" class="v-avatar-light-bg primary--text">
              <v-img v-if="schoolLogo" :src="content_url + schoolLogo"></v-img>
              <v-img v-else :src="require('@/assets/images/avatars/1.png')"></v-img>
            </v-avatar>
          </v-badge>
          <div class="d-inline-flex flex-column justify-center ms-3" style="vertical-align:middle">
            <span class="text--primary font-weight-semibold mb-n1"> {{ userData.account_name }}
              <!-- Admin -->
            </span>
            <small v-if="userData.account_type === 'manager'" class="text--disabled text-capitalize">مدير</small>
            <small v-else class="text--disabled text-capitalize">ادمن</small>
          </div>
        </div>
        <!-- <v-divider></v-divider> -->
        <!-- Profile -->
        <!-- <v-list-item @click="$router.push('/setting')">
          <v-list-item-icon class="me-2">
            <v-icon size="22"> fa-cog </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>الاعدادت</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <!-- Email -->
        <!-- <v-list-item href="#">
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiEmailOutline }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Inbox</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
        <!-- Chat -->
        <!-- <v-list-item href="#">
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiChatOutline }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Chat</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-badge
            inline
            color="error"
            content="2"
          >
          </v-badge>
        </v-list-item-action>
      </v-list-item> -->
        <v-divider class="my-2"></v-divider>
        <!-- Settings -->
        <!-- <v-list-item href="#">
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiCogOutline }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
        <!-- Pricing -->
        <!-- <v-list-item href="#">
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiCurrencyUsd }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Pricing</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
        <!-- FAQ -->
        <!-- <v-list-item href="#">
        <v-list-item-icon class="me-2">
          <v-icon size="22">
            {{ icons.mdiHelpCircleOutline }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>FAQ</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
        <!-- <v-divider class="my-2"></v-divider> -->
        <!-- Logout -->
        <v-list-item @click="logout">
          <v-list-item-icon class="me-2">
            <v-icon size="22"> {{ icons.mdiLogoutVariant }} </v-icon>
            <!-- <v-icon size="22">
            {{ $store.state.FileUrl + schoolLogo }}
          </v-icon> -->
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>تسجيل خروج</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="settingDailog.open" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">تعديل رمز الطالب</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="settingData.study_year" label="الرمز" outlined required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="settingDailog.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="settingDailog.loading" @click="submitChangeYear"> تعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <!-- Edit dialog -->
</template>

<script>
import {
  mdiAccountOutline, mdiChatOutline, mdiCheckboxMarkedOutline, mdiCogOutline,
  mdiCurrencyUsd, mdiEmailOutline, mdiHelpCircleOutline,
  mdiLogoutVariant
} from '@mdi/js'

export default {
  // setup() {
  //   const userData = JSON.parse(localStorage.getItem('results'))

  //   return {
  //     userData,
  //     icons: {
  //       mdiAccountOutline,
  //       mdiEmailOutline,
  //       mdiCheckboxMarkedOutline,
  //       mdiChatOutline,
  //       mdiCogOutline,
  //       mdiCurrencyUsd,
  //       mdiHelpCircleOutline,
  //       mdiLogoutVariant,
  //     },
  //   }
  // },
  created() {
    this.userData = JSON.parse(localStorage.getItem('results'))
    this.schoolLogo = this.userData.school_img
    this.content_url = this.userData.content_url
  },
  data() {
    return {
      userData: {},
      schoolLogo: null,
      content_url: null,
      settingDailog: {
        open: false,
        loading: false
      },
      settingData: {
        study_year: "2021-2022"
      },
      icons: {
        mdiAccountOutline,
        mdiEmailOutline,
        mdiCheckboxMarkedOutline,
        mdiChatOutline,
        mdiCogOutline,
        mdiCurrencyUsd,
        mdiHelpCircleOutline,
        mdiLogoutVariant,
      },
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('submitLogout')
    },
    submitChangeYear() {
      console.log('====================================');
      console.log(setting);
      console.log('====================================');
    }
  },
}
</script>

<style lang="scss">
.user-profile-menu-content {
  .v-list-item {
    min-height: 2.5rem !important;
  }
}
</style>
