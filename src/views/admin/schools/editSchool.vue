<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text mb-2"> تعديل روضة </h1>
        <h3 class="text-center subtitle-4 black--text"> {{ $route.params.school_name }}</h3>
        <v-form v-model="isFormValid">
          <v-row class="mt-5">
            <!-- school_name -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_name" :rules="Rules.school_name" dense label="اسم الروضة"
                outlined></v-text-field>
            </v-col>
            <!-- phone -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_phone" :rules="Rules.phone" dense label="الهاتف" outlined>
              </v-text-field>
            </v-col>
            <!-- location -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_location" :rules="Rules.location" dense label="الموقع" outlined>
              </v-text-field>
            </v-col>
            <!-- notifications_img1 -->
            <v-col md="6" sm="6" cols="12">
              <div class="d-flex justify-space-around align-center">
                <v-btn text color="primary" @click="$refs.img1Upload.click()"> اضافة لوكو </v-btn>
                <input v-show="false" id="img1" ref="img1Upload" type="file" @change="changeImg1($event)" />
                <div style="width: 70px; height: 70px; border: 1px solid red">
                  <img class="teacher_image_table" :src="showLogo()" />
                </div>
              </div>
            </v-col>
            <!-- notifications_img2 -->
            <v-col md="6" sm="6" cols="12">
              <div class="d-flex justify-space-around align-center">
                <v-btn text color="primary" @click="$refs.img2Upload.click()"> اضافة صورة (اختياري) </v-btn>
                <input v-show="false" id="img2" ref="img2Upload" type="file" @change="changeImg2($event)" />
                <div style="width: 70px; height: 70px; border: 1px solid red">
                  <img class="teacher_image_table" style="width: 70px; height: 70px" :src="showImg()" />
                </div>
              </div>
            </v-col>
            <!-- facebook -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_facebook" dense label="فيسبوك (اختياري)" outlined>
              </v-text-field>
            </v-col>
            <!-- whatsapp -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_whatsapp" dense label="الواتساب (اختياري)" outlined>
              </v-text-field>
            </v-col>
            <!-- website -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_website" dense label="الويب (اختياري)" outlined></v-text-field>
            </v-col>
            <!-- google_map -->
            <v-col sm="6" cols="12">
              <v-text-field v-model="teacherData.school_google_map" dense label="خرائط غوغل (اختياري)" outlined>
              </v-text-field>
            </v-col>
            <!-- currency -->
            <v-col sm="6" cols="12">
              <v-select v-model="teacherData.school_currency" item-text="text" item-value="value" :items="currencyItems"
                dense label="العملة النقدية" outlined>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-center"> الخصائص </h3>
            </v-col>
            <!-- features_finger_id -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_finger_id" label="البصمة" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_absence -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_absence" label="الحضور" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_teachers_absence -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_teachers_absence" label="حضور الاساتذة" color="primary"
                hide-details></v-checkbox>
            </v-col>
            <!-- features_review -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_review" label="التقييم" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_dailyExam -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_dailyExam" label="الامتحانات اليومية" color="primary"
                hide-details></v-checkbox>
            </v-col>
            <!-- features_drivers -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_drivers" label="السواق" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_exams -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_exams" label="الامتحانات" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_chat -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_chat" label="المراسلة" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_gps -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_gps" label="خرائط غوغل (gps)" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_notifications -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_notifications" label="الاشعارات" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_schedule_weekly -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_schedule_weekly" label="الجدول الاسبوعي" color="primary"
                hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_subject -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_subject" label="المواد الدراسية" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_degrees -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_degrees" label="الدرجات" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_employee -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_employee" label="الموظفين" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_live -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_live" label="البث المباشر" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_latest_news -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_latest_news" label="اخر الاخبار" color="primary" hide-details>
              </v-checkbox>
            </v-col>
            <!-- features_accountant -->
            <v-col cols="12" sm="4" md="3">
              <v-checkbox v-model="teacherData.features_accountant" label="الحسابات" color="primary" hide-details>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <!-- description -->
            <v-col cols="12" class="mt-5">
              <v-textarea v-model="teacherData.school_description" :rules="Rules.description" name="input-7-1"
                label="الوصف" append-icon="fa-scroll" outlined></v-textarea>
            </v-col>
          </v-row>
        </v-form>
        <div class="d-flex justify-center mt-2">
          <v-btn :loading="addBtnLoading" :disabled="!isFormValid" color="primary" @click="submitAdd()"> تعديل </v-btn>
          <v-btn class="mr-5" @click="cancelAdd()"> الغاء </v-btn>
        </div>
      </v-card>
    </v-container>
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
import adminApi from '@/api/adminApi'
import { convertModelToFormData } from '@/utility/formData'

export default {
  data() {
    return {
      imgAndDivShowControll: {
        IsDiv1Showing: true,
        isImg1Showing: false,

        IsDiv2Showing: true,
        isImg2Showing: false,

        IsDiv3Showing: true,
        isImg3Showing: false,
      },

      img1Url: null,
      img2Url: null,
      img3Url: null,

      studentLoading: false,

      classLoading: false,

      isFormValid: false,

      Rules: {
        school_name: [value => !!value || 'الاسم مطلوب'],
        phone: [value => !!value || 'الهاتف مطلوب'],
        location: [value => !!value || 'العنوان مطلوب'],
        description: [value => !!value || 'الوصف مطلوب'],
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      isClassSchoolSelectShowing: false,

      isStudentSelectShowing: false,

      teacherData: {
        school_name: '',
        school_description: '',
        school_website: '',
        school_facebook: '',
        school_logo: null,
        old_school_logo: null,
        school_img: null,
        old_school_img: null,
        school_whatsapp: '',
        school_phone: '',
        school_google_map: '',
        school_location: '',
        school_currency: 'IQD',
        features_finger_id: true,
        features_absence: true,
        features_teachers_absence: true,
        features_review: true,
        features_dailyExam: true,
        features_drivers: true,
        features_gps: true,
        features_chat: true,
        features_exams: true,
        features_accountant: true,
        features_notifications: true,
        features_subject: true,
        features_latest_news: true,
        features_degrees: true,
        features_employee: true,
        features_live: true,
        features_schedule_weekly: true,
      },

      content_url: null,

      addBtnLoading: false,

      currencyItems: [
        { text: 'عراقي', value: 'IQD' },
        { text: 'دولار', value: 'US' },
      ],
    }
  },

  created() {
    this.getDataAxios()
  },

  methods: {
    async getDataAxios() {
      const response = await adminApi.getOneSchools(this.$route.params.school_id)

      console.log('response', response)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.teacherData = response.data.results

        this.content_url = response.data.content_url

        this.teacherData.features_finger_id = response.data.results.school_features.features_finger_id
        this.teacherData.features_absence = response.data.results.school_features.features_absence
        this.teacherData.features_teachers_absence = response.data.results.school_features.features_teachers_absence
        this.teacherData.features_review = response.data.results.school_features.features_review
        this.teacherData.features_dailyExam = response.data.results.school_features.features_dailyExam
        this.teacherData.features_drivers = response.data.results.school_features.features_drivers
        this.teacherData.features_exams = response.data.results.school_features.features_exams
        this.teacherData.features_notifications = response.data.results.school_features.features_notifications
        this.teacherData.features_chat = response.data.results.school_features.features_chat
        this.teacherData.features_gps = response.data.results.school_features.features_gps
        this.teacherData.features_accountant = response.data.results.school_features.features_accountant
        this.teacherData.features_schedule_weekly = response.data.results.school_features.features_schedule_weekly
        this.teacherData.features_live = response.data.results.school_features.features_live
        this.teacherData.features_subject = response.data.results.school_features.features_subject
        this.teacherData.features_live = response.data.results.school_features.features_live
        this.teacherData.features_degrees = response.data.results.school_features.features_degrees
        this.teacherData.features_latest_news = response.data.results.school_features.features_latest_news
        this.teacherData.features_employee = response.data.results.school_features.features_employee
      }
    },

    async submitAdd() {
      const img1 = document.querySelector('#img1')

      const img2 = document.querySelector('#img2')

      this.addBtnLoading = true

      this.teacherData.old_school_logo = this.teacherData.school_logo

      if (img1.files.length >= 1) {
        this.teacherData.school_logo = img1.files[0]
      } else {
        delete this.teacherData.school_logo
      }

      this.teacherData.old_school_img = this.teacherData.school_img

      if (img2.files.length >= 1) {
        this.teacherData.school_img = img2.files[0]
      } else {
        delete this.teacherData.school_img
      }

      const formData = convertModelToFormData(this.teacherData)

      const response = await adminApi.editSchools(formData)
      if (response.status === 401) {
        this.addBtnLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.addBtnLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.addBtnLoading = false
        this.teacherData.school_logo = this.teacherData.old_school_logo
        this.teacherData.school_img = this.teacherData.old_school_img
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    cancelAdd() {
      this.$router.back(1)
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    showLogo() {
      if (!this.img1Url) {
        return this.content_url + this.teacherData.school_logo
      } else {
        return this.img1Url
      }
    },

    showImg() {
      if (!this.img2Url) {
        return this.content_url + this.teacherData.school_img
      }

      return this.img2Url
    },

    changeImg1(event) {
      this.imgAndDivShowControll.IsDiv1Showing = false
      this.imgAndDivShowControll.isImg1Showing = true

      const file = event.target.files[0]
      this.img1Url = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.img1Url = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.img1Url = null
      }
    },

    changeImg2(event) {
      this.imgAndDivShowControll.IsDiv2Showing = false
      this.imgAndDivShowControll.isImg2Showing = true

      const file = event.target.files[0]
      this.img2Url = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.img2Url = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.img2Url = null
      }
    },
  },
}
</script>

<style scoped>
.teacher_image_table {
  cursor: pointer;
  width: 70px;
  height: 70px;
}
</style>
