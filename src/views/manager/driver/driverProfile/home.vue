<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> الملف الشخصي </h1>
      <h2 class="text-center subtitle-5 black--text"> ({{ $route.params.name }}) </h2>
      <v-row v-if="isPageNotLoading" class="mt-5">
        <v-col md="8" sm="12" cols="12">
          <img v-if="teacherData.account_img" :src="content_url + teacherData.account_img" alt="" width="200"
            height="200" />
          <img v-else src="../../../../assets/img/default_profile.png" alt="" width="200" height="200" />
        </v-col>
        <v-col md="4" sm="12" cols="12">
          <!-- name -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الاسم </span> {{ teacherData.account_name }}
          </div>
          <!-- mobile -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الهاتف </span> {{ teacherData.account_mobile }}
          </div>
          <!-- gender -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الجنس</span> {{ teacherData.account_gender }}
          </div>
          <!-- email -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الايميل </span> {{ teacherData.account_email }}
          </div>
          <!-- password -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الرمز </span> {{ teacherData.account_password_show }}
          </div>
          <!-- address -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">العنوان </span> {{ teacherData.account_address }}
          </div>
          <!-- startDate -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">تاريخ بدء العمل </span> {{ teacherData.account_start_date }}
          </div>
          <!-- accountSalary -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الراتب </span> {{ teacherData.account_salary }}
          </div>
          <!-- studentCount -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">عدد الطلاب</span> {{ teacherData.number_of_student }}
          </div>
          <!-- vacation -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">عدد الاجازات المسموح بها خلال السنة</span> {{ teacherData.account_max_vacation
            }}
          </div>
          <!-- notification -->
          <div v-if="teacherData.isAccountCanSendNotification === true" class="py-2 px-2 d-flex justify-space-between"
            style="border: 1px solid cyan">
            <span class="primary--text">ارسال رسائل او تقارير </span> فعال
          </div>
          <div v-else class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">ارسال رسائل او تقارير </span> متوقف
          </div>
          <!-- accountDisable -->
          <div v-if="teacherData.isAccountDisabled === false" class="py-2 px-2 d-flex justify-space-between"
            style="border: 1px solid cyan">
            <span class="primary--text">الحساب</span> فعال
          </div>
          <div v-else class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الحساب</span> متوقف
          </div>
          <!-- accountBirthday -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">تاريخ الميلاد</span> {{ teacherData.account_birthday }}
          </div>
          <!-- accountCarType -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">نوع السيارة</span> {{ teacherData.account_car_type }}
          </div>
          <!-- accountCarColor -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">لون السيارة</span> {{ teacherData.account_car_color }}
          </div>
          <!-- accountCarNumber -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">رقم السيارة</span> {{ teacherData.account_car_number }}
          </div>
        </v-col>
      </v-row>
      <v-row v-else class="mt-10 mb-2 d-flex justify-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-row>
    </v-card>
    <!--- Dailog for show info to user-->
    <v-dialog v-model="dialogData.open" max-width="500px">
      <v-toolbar :color="dialogData.color" dense></v-toolbar>
      <v-card>
        <v-card-title class="headline justify-center"> {{ dialogData.bodyText }} </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogData.open = false"> تم </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Api from '@/api/api'

export default {
  data() {
    return {
      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },


      teacherData: {},
      isPageNotLoading: true,
      content_url: null,
    }
  },
  created() {
    this.getTeacherDataAxios()
  },

  methods: {
    async getTeacherDataAxios() {
      this.isPageNotLoading = false

      const response = await Api.getOneDriver(this.$route.params.id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.isPageNotLoading = true
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.isPageNotLoading = true
        this.teacherData = response.data.results
        this.content_url = response.data.content_url
        console.log(this.teacherData)
      }
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },
  },
}
</script>

<style>
.teacher_image_table {
  cursor: pointer;
}
</style>
