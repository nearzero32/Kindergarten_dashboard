<template>
  <div class="team">
    <v-card id="printable" class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> الملف الشخصي </h1>
      <h2 class="text-center subtitle-5 black--text"> ({{ $route.params.name }}) </h2>
      <v-row v-if="isPageNotLoading" class="mt-5">
        <v-col md="7" sm="12" cols="12">
          <img v-if="teacherData.account_img" :src="content_url + teacherData.account_img" alt="" width="200"
            height="200" />
          <img v-else src="../../../../assets/img/default_profile.png" alt="" width="200" height="200" />
          <div>
            <v-btn color="primary" class="mt-2" @click="goToAbsence"> عرض الغيابات والحضور </v-btn>
          </div>
          <div>
            <v-btn color="primary" class="mt-2" @click="goToNotificatoin"> عرض الاشعارات </v-btn>
          </div>
          <div>
            <v-btn color="warning" class="mt-2" @click="goToBills" v-if="account_type === 'manager'"> عرض الحساب </v-btn>
          </div>
          <div>
            <v-btn color="success" class="mt-2" @click="goToPrintPage"> طباعة </v-btn>
          </div>
        </v-col>
        <v-col md="5" sm="12" cols="12">
          <!-- <div class="mb-2 d-flex justify-center">
            <v-btn
              color="warning"
              @click="printDiv"
            >
              طباعة
            </v-btn>
          </div> -->
          <!-- name -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الاسم </span> {{ teacherData.account_name }}
          </div>
          <!-- mobile1 -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الهاتف الاول </span> {{ teacherData.account_mobile1 }}
          </div>
          <!-- mobile2 -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الهاتف الثاني </span> {{ teacherData.account_mobile2 }}
          </div>
          <!-- mobile3 -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الهاتف الثالث </span> {{ teacherData.account_mobile3 }}
          </div>
          <!-- mobile4 -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الهاتف الرابع </span> {{ teacherData.account_mobile4 }}
          </div>
          <!-- card_number -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">رقم البصمة الاولى</span> {{ teacherData.account_card_number }}
          </div>
          <!-- card_number two -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">رقم البصمة الثانية</span> {{ teacherData.account_card_number_two }}
          </div>
          <!-- email -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الايميل </span> {{ teacherData.account_email }}
          </div>
          <!-- password -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الرمز </span> {{ teacherData.account_password_show }}
          </div>
          <!-- account_home -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">المنزل </span> {{ teacherData.account_home }}
          </div>
          <!-- account_city -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">المحلة </span> {{ teacherData.account_city }}
          </div>
          <!-- account_alley -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الزقاق </span> {{ teacherData.account_alley }}
          </div>
          <!-- account_nearest_point -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">اقرب نقطة دالة </span> {{ teacherData.account_nearest_point }}
          </div>
          <!-- notification -->
          <!-- <div v-if="teacherData.isAccountCanSendNotification === true" class="py-2 px-2 d-flex justify-space-between"
            style="border: 1px solid cyan">
            <span class="primary--text">ارسال رسائل او تقارير </span> فعال
          </div>
          <div v-else class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">ارسال رسائل او تقارير </span> متوقف
          </div> -->
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
          <!-- classSchool -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">الصف والشعبة</span> {{ teacherData.account_division_current.class_name }}--{{
                teacherData.account_division_current.leader
            }}
          </div>
          <!-- father_img_id -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">هوية الاب</span>
            <v-btn v-if="account_document.father_img_id" small color="primary"
              @click="goToPdf(account_document.father_img_id)"> عرض </v-btn>
            <span v-else>لا يوجد</span>
          </div>
          <!-- mother_img_id -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">هوية الام</span>
            <v-btn v-if="account_document.mother_img_id" small color="primary"
              @click="goToPdf(account_document.mother_img_id)"> عرض </v-btn>
            <span v-else>لا يوجد</span>
          </div>
          <!-- assistance_img_id -->
          <div class="py-2 px-2 d-flex justify-space-between" style="border: 1px solid cyan">
            <span class="primary--text">هوية المخول</span>
            <v-btn v-if="account_document.assistance_img_id" small color="primary"
              @click="goToPdf(account_document.assistance_img_id)"> عرض </v-btn>
            <span v-else>لا يوجد</span>
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
      teacherData: {
        account_home: null,
        account_area: null,
        account_city: null,
        account_alley: null,
        account_nearest_point: null,
        account_birthday: null,
        account_email: null,
        account_gender: null,
        account_id: null,
        account_mobile1: null,
        account_mobile2: null,
        account_mobile3: null,
        account_mobile4: null,
        account_name: null,
        account_password_show: null,
        account_payment_type: null,
        account_school: null,
        account_type: null,
        isAccountCanSendNotification: true,
        isAccountDeleted: false,
        isAccountDisabled: false,
        account_document: {
          certificate_national_id: null,
          certificate_national_old: null,
          certificate_passport: null,
          certificate_nationality: null,
          certificate_address: null,
        },
      },

      account_document: {
        certificate_national_id: null,
        certificate_national_old: null,
        certificate_passport: null,
        certificate_nationality: null,
        certificate_address: null,
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      teacherData: {},
      isPageNotLoading: true,
      featuredFingerId: 1,
      content_url: null,
      account_type: null,
    }
  },
  created() {
    const resultsLocalStorage = JSON.parse(localStorage.getItem('results'))
    this.featuredFingerId = resultsLocalStorage.features_finger_id
    this.getTeacherDataAxios()
    this.account_type = JSON.parse(localStorage.getItem('results')).account_type
  },

  methods: {
    async getTeacherDataAxios() {
      this.isPageNotLoading = false

      const response = await Api.getOneStudent(this.$route.params.id)
      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
        this.isPageNotLoading = true
      } else if (response.status === 500) {
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.isPageNotLoading = true
        this.teacherData = response.data.results
        ;(this.account_document = response.data.results.account_document
          ? response.data.results.account_document
          : {
              certificate_national_id: null,
              certificate_national_old: null,
              certificate_passport: null,
              certificate_nationality: null,
              certificate_address: null,
            }),
          (this.content_url = response.data.content_url)
      }
    },

    goToAbsence() {
      this.$router.push(`/showAbsence/show/details/${this.$route.params.id}/${this.$route.params.name}`)
    },
    goToNotificatoin() {
      this.$router.push(
        `/notificationForStudent/${this.teacherData.account_division_current._id}/${this.$route.params.id}/${this.$route.params.name}`,
      )
    },
    goToBills() {
      this.$router.push(`/studentBills/studentId/${this.$route.params.id}/studentName/${this.$route.params.name}`)
    },

    goToPrintPage() {
      let routeData = this.$router.resolve({ name: 'printOneStudents' })
      window.open(routeData.href, '_blank')

      localStorage.setItem('printOneStudents', JSON.stringify(this.teacherData))
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },
    goToPdf(file) {
      window.open(this.content_url + file)
    },
  },
}
</script>

<style scoped>
.teacher_image_table {
  cursor: pointer;
}

/* @media print {
  body {
    overflow: auto;
    height: auto;
  }
  div {
    display: flex;
    justify-content: space-between;
    padding: 25px 0;
  }
  .scroll-y {
    height: auto;
    overflow: visible;
  }
} */
</style>
