<template>
  <component :is="resolveLayoutVariant" :class="`skin-variant--${appSkinVariant}`">
    <transition :name="appRouteTransition" mode="out-in" appear>
      <router-view></router-view>
    </transition>
  </component>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { computed, onMounted, ref } from '@vue/composition-api'
// eslint-disable-next-line import/no-unresolved
import useAppConfig from '@core/@app-config/useAppConfig'
import { useLayout } from '@core/layouts/composable/useLayout'
import { useRouter } from '@core/utils'

// Layouts
import api from '@/api/api'
import LayoutBlank from '@/layouts/variants/blank/LayoutBlank.vue'
import LayoutContentVerticalNavAccount from '@/layouts/variants/content/account-nav/accountNav.vue'
import LayoutContentVerticalNavAdmin from '@/layouts/variants/content/admin-nav/adminNav.vue'
import LayoutContentHorizontalNav from '@/layouts/variants/content/horizontal-nav/LayoutContentHorizontalNav.vue'
import LayoutContentVerticalNav from '@/layouts/variants/content/vertical-nav/LayoutContentVerticalNav.vue'
import useDynamicVh from '@core/utils/useDynamicVh'

// if (account_type === 'manager') {
//   var nav = LayoutContentVerticalNav
// } else {
//   var nav = LayoutContentVerticalNavAdmin
// }

// Dynamic vh

export default {
  components: {
    LayoutContentVerticalNav,
    LayoutContentVerticalNavAdmin,
    LayoutContentVerticalNavAccount,
    LayoutContentHorizontalNav,
    LayoutBlank,
  },
  setup() {
    const { route } = useRouter()

    const features = ref({
      features_finger_id: true,
      features_absence: true,
      features_teachers_absence: true,
      features_review: true,
      features_dailyExam: true,
      features_drivers: true,
      features_exams: true,
      features_notifications: true,
      features_chat: true,
      features_gps: true,
      features_schedule_weekly: true,
      features_accountant: true
    });

    const study_year = ref({})

    const studyYearData = ref([])

    const { appContentLayoutNav, appSkinVariant, appRouteTransition } = useAppConfig()

    const { handleBreakpointLayoutSwitch } = useLayout()
    handleBreakpointLayoutSwitch()

    onMounted(async () => {
      const mainData = await api.mainData()

      features.value = mainData.data.features

      study_year.value = mainData.data.study_year

      studyYearData.value = mainData.data.studyYearData

      localStorage.setItem("features", JSON.stringify(features.value))

      localStorage.setItem("study_year", JSON.stringify(study_year.value))

      localStorage.setItem("studyYearData", JSON.stringify(studyYearData.value))

    })

    const resolveLayoutVariant = computed(() => {
      // const resultsLocalStorage = JSON.parse(localStorage.getItem('results'))

      if (route.value.meta.layout === 'blank') return 'layout-blank'

      if (route.value.meta.layout === 'content') {
        // let accountType

        // if (resultsLocalStorage) {
        //   const accountType = resultsLocalStorage
        // } else {
        //   const accountType = 'none'
        // }
        const resultsLocalStorage = JSON.parse(localStorage.getItem('results'))

        const accountType = resultsLocalStorage.account_type

        // const localStorage = JSON.parse(localStorage.getItem('typeDashboard'))

        // const typeDashboard = localStorage.account

        if (accountType === 'manager') {
          return 'layout-content-vertical-nav'
        }

        if (accountType === 'admin') {
          console.log('adminDashboard');
          return 'layout-content-vertical-nav-admin'
        }


      }

      return null
    })

    useDynamicVh()

    return {
      resolveLayoutVariant,
      appSkinVariant,
      appRouteTransition,
    }
  },
}
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #a8bbbf;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
