<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> اضافة روضة </h1>
        <v-form v-model="isFormValid">
          <v-row class="mt-5">
            <!-- school_name -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_name" :rules="Rules.school_name" dense label="اسم الروضة"
                outlined></v-text-field>
            </v-col>
            <!-- phone1 -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_phone1" :rules="Rules.phone" dense label="الهاتف الاول"
                outlined>
              </v-text-field>
            </v-col>
            <!-- phone2 -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_phone2" dense label="الهاتف الثاني" outlined>
              </v-text-field>
            </v-col>
            <!-- location -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.school_location" :rules="Rules.location" dense label="الموقع" outlined>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <!-- notifications_img1 -->
            <v-col md="6" sm="6" cols="12">
              <div class="d-flex justify-space-around align-center">
                <v-btn text color="primary" @click="$refs.img1Upload.click()"> اضافة لوكو </v-btn>
                <input v-show="false" id="img1" ref="img1Upload" type="file" @change="changeImg1($event)" />
                <div v-show="imgAndDivShowControll.IsDiv1Showing"
                  style="width: 70px; height: 70px; border: 1px solid red"></div>
                <img v-show="imgAndDivShowControll.isImg1Showing" class="teacher_image_table" :src="img1Url" alt
                  width="70" height="70" />
              </div>
            </v-col>
            <!-- notifications_img2 -->
            <v-col md="6" sm="6" cols="12">
              <div class="d-flex justify-space-around align-center">
                <v-btn text color="primary" @click="$refs.img2Upload.click()"> اضافة صورة (اختياري) </v-btn>
                <input v-show="false" id="img2" ref="img2Upload" type="file" @change="changeImg2($event)" />
                <div v-show="imgAndDivShowControll.IsDiv2Showing"
                  style="width: 70px; height: 70px; border: 1px solid red"></div>
                <img v-show="imgAndDivShowControll.isImg2Showing" class="teacher_image_table" :src="img2Url" alt
                  width="70" height="70" />
              </div>
            </v-col>
          </v-row>
          <v-row>
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
            <!-- youtube -->
            <v-col sm="6" cols="12">
              <v-text-field v-model="teacherData.school_youtube" dense label="يوتيوب (اختياري)" outlined>
              </v-text-field>
            </v-col>
            <!-- currency -->
            <v-col sm="6" cols="12">
              <v-select v-model="teacherData.school_currency" item-text="text" item-value="value" :items="currencyItems"
                dense label="العملة النقدية" outlined>
              </v-select>
            </v-col>
            <v-col cols="12">
              <h3 class="text-center"> الخصائص </h3>
            </v-col>
            <!-- description -->
            <v-col cols="12" class="mt-5">
              <v-textarea v-model="teacherData.school_description" :rules="Rules.description" name="input-7-1"
                label="الوصف" append-icon="fa-scroll" outlined></v-textarea>
            </v-col>
          </v-row>
        </v-form>
        <div class="d-flex justify-center mt-2">
          <v-btn :loading="addBtnLoading" :disabled="!isFormValid" color="primary" @click="submitAdd()"> اضافة </v-btn>
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
        school_img: null,
        school_whatsapp: '',
        school_phone1: '',
        school_phone2: '',
        school_youtube: '',
        school_location: '',
        school_currency: 'IQD',
      },

      addBtnLoading: false,

      currencyItems: [
        { text: 'عراقي', value: 'IQD' },
        { text: 'دولار', value: 'US' },
      ],
    }
  },

  methods: {
    async submitAdd() {
      const img1 = document.querySelector('#img1')

      const img2 = document.querySelector('#img2')

      if (!img1.files[0]) {
        this.showDialogfunction('يجب اختيار صورة للوكو', '#FF8A80')
      } else {
        this.addBtnLoading = true

        if ((img1.files).length >= 1) {
          this.teacherData.school_logo = img1.files[0]
        }

        if ((img2.files).length >= 1) {
          this.teacherData.school_img = img2.files[0]
        }




        const formData = convertModelToFormData(this.teacherData)

        const response = await adminApi.addSchools(formData)
        if (response.status === 401) {
          this.addBtnLoading = false
          this.$store.dispatch('submitLogout')
        } else if (response.status === 500) {
          this.addBtnLoading = false
          this.showDialogfunction(response.data.results, '#FF5252')
        } else {
          this.addBtnLoading = false
          this.showDialogfunction(response.data.results, 'primary')
          this.$router.push('adminAddSchool')
        }
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

    formAppend(formData, img1, img2) {
      formData.append('logo', img1.files[0])
      formData.append('img', img2.files[0])
      formData.append('school_name', this.teacherData.school_name)
      formData.append('description', this.teacherData.description)
      formData.append('website', this.teacherData.website)
      formData.append('facebook', this.teacherData.facebook)
      formData.append('whatsapp', this.teacherData.whatsapp)
      formData.append('phone', this.teacherData.phone)
      formData.append('google_map', this.teacherData.google_map)
      formData.append('location', this.teacherData.location)
      formData.append('currency', this.teacherData.currency)
    },
  },
}
</script>
