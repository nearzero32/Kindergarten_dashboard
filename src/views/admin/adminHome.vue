<template>
  <div>
    <!-- user total card -->
    <v-row class="mb-5">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.all_schools }} </h2>
              <span>عدد المدارس</span>
            </div>
            <v-avatar color="#E1F5FE">
              <v-icon size="25" color="#01579B" class="rounded-0"> fa-school </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.student_count }} </h2>
              <span>الطلاب الفعالين</span>
            </div>
            <v-avatar color="#F9FBE7">
              <v-icon size="25" color="#827717" class="rounded-0"> fa-user-graduate </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.teacher_count }} </h2>
              <span>عدد الاساتذة</span>
            </div>
            <v-avatar color="#FBE9E7">
              <v-icon size="25" color="#BF360C" class="rounded-0"> fa-chalkboard-teacher </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.all_notifications }} </h2>
              <span>عدد الاشعارات</span>
            </div>
            <v-avatar color="#E0F2F1">
              <v-icon size="25" color="#004D40" class="rounded-0"> fa-bell </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import adminApi from '@/api/adminApi'

export default {
  data() {
    return {
      data: {
        all_notifications: 0,
        student_count: 0,
        teacher_count: 0,
        all_schools: 0,
      },
    }
  },

  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

      const response = await adminApi.getDashboard()
      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.data = response.data.results
      }
    },
  },
}
</script>
