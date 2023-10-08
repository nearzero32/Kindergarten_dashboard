<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> الملف الشخصي </h1>
      <h2 class="text-center subtitle-5 black--text"> ({{ $route.params.name }}) </h2>
      <v-row v-if="isPageNotLoading" class="mt-5">
        <v-col md="8" sm="12" cols="12">
          <img v-if="teacherData.account_img" :src="$store.state.FileUrl + teacherData.account_img" alt="" width="200"
            height="200" />
          <img v-else src="../../../../assets/img/default_profile.png" alt="" width="200" height="200" />
          <!-- <div>
            <v-btn color="primary" class="mt-2" @click="goToAbsence"> عرض الغيابات والحضور </v-btn>
          </div>
          <div>
            <v-btn color="primary" class="mt-2" @click="goToNotificatoin"> تقييم الاستاذ الالكتروني </v-btn>
          </div> -->
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
          <!-- card_number -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">رقم البصمة</span> {{ teacherData.account_card_number }}
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
            <span class="primary--text">تاريخ بدء العمل </span> {{ teacherData.salariesStartDate }}
          </div>
          <!-- accountSalary -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الراتب </span> {{ teacherData.salariesAmount }}
          </div>
          <!-- paymentType -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">المسمى الوظيفي </span> {{ teacherData.account_payment_type }}
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
          <!-- student_certificate_national_id -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">البطاقة الوطنية</span>
            <v-btn v-if="teacherData.account_document.certificate_national_id" small color="primary"
              @click="goToPdf(teacherData.account_document.certificate_national_id)"> عرض </v-btn>
            <span v-else>لا يوجد</span>
          </div>
          <!-- certificate_national_old -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">هوية الاحوال المدنية</span>
            <v-btn v-if="teacherData.account_document.certificate_national_old" small color="primary"
              @click="goToPdf(teacherData.account_document.certificate_national_old)"> عرض </v-btn>
            <span v-else>لا يوجد</span>
          </div>
          <!-- certificate_passport -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الجواز</span>
            <v-btn v-if="teacherData.account_document.certificate_passport" small color="primary"
              @click="goToPdf(teacherData.account_document.certificate_passport)"> عرض </v-btn>
            <span v-else>لا يوجد</span>
          </div>
          <!-- student_certificate_nationality -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">شهادة الجنسية</span>
            <v-btn v-if="teacherData.account_document.certificate_nationality" small color="primary"
              @click="goToPdf(teacherData.account_document.certificate_nationality)"> عرض </v-btn>
            <span v-else>لا يوجد</span>
          </div>
          <!-- student_certificate_address -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">بطاقة السكن</span>
            <v-btn v-if="teacherData.account_document.certificate_address" small color="primary"
              @click="goToPdf(teacherData.account_document.certificate_address)"> عرض </v-btn>
            <span v-else>لا يوجد</span>
          </div>
          <!-- classSchool -->
          <h3 class="black--text text-center mt-5 mb-2"> الصفوف </h3>
          <div class="py-2 px-2" style="border: 1px solid cyan">
            <p v-for="division in teacherData.account_division" :key="division._id" class="primary--text text-center">
              {{ division.class_name }}--{{ division.leader }} </p>
          </div>
          <!-- account_subject -->
          <h3 class="black--text text-center mt-5 mb-2"> المواد الدراسية </h3>
          <div class="py-2 px-2" style="border: 1px solid cyan">
            <p v-for="subject in teacherData.account_subject" :key="subject._id" class="primary--text text-center"> {{
                subject.subject_name
            }} </p>
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
          <v-btn color="blue darken-1 justify-start" text @click="dialogData.open = false"> تم </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Api from '../../../../api/api'

export default {
  data() {
    return {
      teacherData: {},
      isPageNotLoading: true,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },
    }
  },
  created() {
    this.getTeacherDataAxios()
  },

  methods: {
    async getTeacherDataAxios() {
      this.isPageNotLoading = false

      const response = await Api.getOneTeacher(this.$route.params.id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.isPageNotLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.isPageNotLoading = true
        this.teacherData = response.data.results
      }
    },
    goToPdf(file) {
      window.open(this.$store.state.FileUrl + file)
    },
    goToAbsence() {
      this.$router.push(`/showAbsenceTeacher/show/details/${this.$route.params.id}/${this.$route.params.name}`)
    },
    goToNotificatoin() {
      this.$router.push(`/notificationForTeacher/${this.$route.params.id}/${this.$route.params.name}`)
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
