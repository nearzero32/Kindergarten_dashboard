<template>
  <div class="vertical-nav-header d-flex align-center justify-space-between ps-6 pe-5 pt-5 pb-2">
    <router-link to="/home" class="d-flex align-center text-decoration-none">
      <v-avatar size="40px" color="primary" class="v-avatar-light-bg primary--text ml-1">
        <v-img  :src="content_url + schoolLogo"></v-img>
        <!-- <v-img v-else :src="require('@/assets/images/avatars/1.png')"></v-img> -->
      </v-avatar>
      <v-slide-x-transition>
        <div>
          <h2 v-show="!(menuIsVerticalNavMini && !isMouseHovered)" v-if="schoolName" class="app-title text--primary">
            <!-- {{ appName }} --> {{ schoolName }}
          </h2>
          <!-- <v-img
            :src="$store.state.FileUrl + schoolLogo"
            height="30px"
            width="30px"
            alt="logo"
            contain
            eager
          ></v-img> -->
          <!-- <h2
            v-show="!(menuIsVerticalNavMini && !isMouseHovered)"
            v-else
            class="app-title text--primary"
          >
            {{ appName }}
          <!-- {{ schoolName }} -->
          <!-- </h2> -->
        </div>
      </v-slide-x-transition>
    </router-link>
    <v-slide-x-transition>
      <div v-show="!(menuIsVerticalNavMini && !isMouseHovered)" v-if="$vuetify.breakpoint.lgAndUp"
        class="d-flex align-center ms-1" @click.stop="menuIsVerticalNavMini = !menuIsVerticalNavMini">
        <v-icon v-show="!menuIsVerticalNavMini" size="20" class="cursor-pointer"> {{ icons.mdiRecordCircleOutline }}
        </v-icon>
        <v-icon v-show="menuIsVerticalNavMini" size="20" class="cursor-pointer"> {{ icons.mdiRadioboxBlank }} </v-icon>
      </div>
      <v-icon v-else size="20" class="d-inline-block" @click.stop="$emit('close-nav-menu')"> {{ icons.mdiClose }}
      </v-icon>
    </v-slide-x-transition>
  </div>
</template>

<script>
import useAppConfig from '@core/@app-config/useAppConfig'
import { mdiClose, mdiRadioboxBlank, mdiRecordCircleOutline } from '@mdi/js'
import themeConfig from '@themeConfig'
import { inject } from '@vue/composition-api'

export default {
  setup() {
    const { menuIsVerticalNavMini } = useAppConfig()
    const isMouseHovered = inject('isMouseHovered')
    const results = JSON.parse(localStorage.getItem('results'))

    const schoolName = results.school_name
    const content_url = results.content_url
    const schoolLogo = results.school_logo

    return {
      menuIsVerticalNavMini,
      isMouseHovered,
      appName: themeConfig.app.name,
      schoolName,
      content_url,
      schoolLogo,
      appLogo: themeConfig.app.logo,

      // Icons
      icons: {
        mdiClose,
        mdiRadioboxBlank,
        mdiRecordCircleOutline,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;

  .v-navigation-drawer--mini-variant & {
    transform: translateX(8px);
  }
}
</style>
