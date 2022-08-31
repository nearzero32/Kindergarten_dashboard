<template>
  <div>
    <!-- user total card -->
    <v-row class="mb-5">
      <!-- <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.available_student_count }} </h2>
              <span>الطلاب الفعالين</span>
            </div>
            <v-avatar color="#F9FBE7">
              <v-icon size="25" color="#827717" class="rounded-0"> fa-user-graduate </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col> -->
      <v-col cols="12" sm="6" md="3">
        <v-card @click="$router.push('/allStudent')">
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.student_count }} </h2>
              <span>عدد الطلاب</span>
            </div>
            <v-avatar color="#E8F5E9">
              <v-icon size="25" color="#1B5E20" class="rounded-0"> fa-user-graduate </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.available_teacher_count }} </h2>
              <span>عدد الاساتذة الفعالين</span>
            </div>
            <v-avatar color="#FBE9E7">
              <v-icon size="25" color="#BF360C" class="rounded-0"> fa-chalkboard-teacher </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col> -->
      <v-col cols="12" sm="6" md="3">
        <v-card @click="$router.push('/teachers')">
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.teacher_count }} </h2>
              <span>عدد الاساتذة</span>
            </div>
            <v-avatar color="#FAFAFA">
              <v-icon size="25" color="#212121" class="rounded-0"> fa-chalkboard-teacher </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" sm="6" md="3">
        <v-card @click="$router.push('/drivers')">
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.driver_count }} </h2>
              <span>عدد السواق</span>
            </div>
            <v-avatar color="#E0F7FA">
              <v-icon size="25" color="#006064" class="rounded-0"> fa-bus </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col> -->
      <!-- <v-col cols="12" sm="6" md="3">
        <v-card @click="$router.push('/examsShow')">
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.exams_count }} </h2>
              <span>عدد الامتحانات</span>
            </div>
            <v-avatar color="#E0F2F1">
              <v-icon size="25" color="#004D40" class="rounded-0"> fa-question-circle </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col> -->
      <!-- <v-col cols="12" sm="6" md="3">
          <v-card @click="$router.push('/classSchool')">
            <v-card-text class="d-flex align-center justify-space-between pa-4">
              <div>
                <h2 class="font-weight-semibold mb-1"> {{ data.school_class_count }} </h2>
                <span>عدد الشعب</span>
              </div>
              <v-avatar color="#E8EAF6">
                <v-icon size="25" color="#1A237E" class="rounded-0"> fa-school </v-icon>
              </v-avatar>
            </v-card-text>
          </v-card>
        </v-col> -->
      <v-col cols="12" sm="6" md="3">
        <v-card @click="$router.push('/notification')">
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.all_notifications }} </h2>
              <span>عدد الاشعارات</span>
            </div>
            <v-avatar color="#FFFDE7">
              <v-icon size="25" color="#F57F17" class="rounded-0"> fa-bell </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card @click="$router.push('/subject')">
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.school_subjects_count }} </h2>
              <span>عدد المواد</span>
            </div>
            <v-avatar color="#E8F5E9">
              <v-icon size="25" color="#2E7D32" class="rounded-0"> fa-book </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col
        cols="12"
        sm="6"
        md="3"
        offset-md="3"
      >
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1">
                {{ data.allRequistVacations }}
              </h2>
              <span>طلبات الاجازة</span>
            </div>

            <v-avatar
              color="#FBE9E7"
            >
              <v-icon
                size="25"
                color="#BF360C"
                class="rounded-0"
              >
                fa-calendar-alt
              </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col> -->
      <!-- <v-col cols="12" sm="6" md="3" offset-md="4">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1"> {{ data.allClass }} </h2>
              <span>عدد الصفوف</span>
            </div>
            <v-avatar color="#FAFAFA">
              <v-icon size="25" color="#212121" class="rounded-0"> fa-school </v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>
  </div>
</template>

<script>
import api from '@/api/api'
export default {
  data() {
    return {
      data: {
        school_class_count: null,
        school_subjects_count: null,
        exams_count: null,
        student_count: null,
        teacher_count: null,
        driver_count: null
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

      const study_year = JSON.parse(localStorage.getItem("study_year"))

      const response = await api.getDashboard(study_year)

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
