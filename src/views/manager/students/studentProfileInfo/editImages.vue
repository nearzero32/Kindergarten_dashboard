<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> تعديل المستمسكات </h1>
      <h2 class="text-center subtitle-5 black--text">({{ $route.params.name }})</h2>
      <v-container class="px-15">
        <v-form v-model="isFormValid">
          <v-row v-if="isPageNotLoading" class="mt-10">
            <!-- name -->
            <div style="margin:auto" class="parent_images">
              <div class="d-flex align-center">
                <v-btn text color="primary" @click="$refs.imgAccountUpload.click()">تعديل صورة الطفل</v-btn>
                <input v-show="false" id="account_img" ref="imgAccountUpload" type="file"
                  @change="changeAccountImg($event)"
                  accept="image/apng, image/avif, image/jpeg, image/jpg, image/png, image/webp" />
              </div>
              <div class="d-flex align-center">
                <div style="width: 150px; height: 150px; border: 1px solid red">
                  <img style="width: 150px; height: 150px" :src="showAccountImg()" />
                </div>
              </div>
              <div class="d-flex align-center">
                <v-btn text color="primary" @click="$refs.imgFatherUpload.click()">تعديل صورة الاب</v-btn>
                <input v-show="false" id="father_img" ref="imgFatherUpload" type="file"
                  @change="changeFatherImg($event)"
                  accept="image/apng, image/avif, image/jpeg, image/jpg, image/png, image/webp" />
              </div>
              <div class="d-flex align-center">
                <div style="width: 150px; height: 150px; border: 1px solid red">
                  <img style="width: 150px; height: 150px" :src="showFatherImg()" />
                </div>
              </div>
              <div class="d-flex align-center">
                <v-btn text color="primary" @click="$refs.motherImgUpload.click()">تعديل صورة الام</v-btn>
                <input v-show="false" id="mother_img" ref="motherImgUpload" type="file"
                  @change="changeMotherImg($event)"
                  accept="image/apng, image/avif, image/jpeg, image/jpg, image/png, image/webp" />
              </div>
              <div class="d-flex align-center">
                <div style="width: 150px; height: 150px; border: 1px solid red">
                  <img style="width: 150px; height: 150px" :src="showMotherImg()" />
                </div>
              </div>
              <div class="d-flex align-center">
                <v-btn text color="primary" @click="$refs.assistanceImgUpload.click()">تعديل صورة المخول</v-btn>
                <input v-show="false" id="assistance_img" ref="assistanceImgUpload" type="file"
                  @change="changeAssistanceImg($event)"
                  accept="image/apng, image/avif, image/jpeg, image/jpg, image/png, image/webp" />
              </div>
              <div class="d-flex align-center">
                <div style="width: 150px; height: 150px; border: 1px solid red">
                  <img style="width: 150px; height: 150px" :src="showAssistanceImg()" />
                </div>
              </div>
            </div>
          </v-row>
          <v-row v-else class="mt-5 mb-2 d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-row>
        </v-form>
        <div v-if="isPageNotLoading" class="d-flex justify-center btn_mobile">
          <v-btn :loading="editBtnLoading" :disabled="!isFormValid" color="primary" @click="submitAdd()"> تعديل </v-btn>
        </div>
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
    </v-card>
  </div>
</template>
<script>
import Api from '@/api/api'
import { convertModelToFormData } from '@/utility/formData'

export default {
  data() {
    return {
      editBtnLoading: false,

      isFormValid: false,

      menuNewPaymentDate: false,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      Rules: {
        account_nameRules: [value => !!value || 'الاسم مطلوب'],
        account_birthdayRules: [value => !!value || 'يوم الميلاد مطلوب'],
        account_genderRules: [value => !!value || 'الجنس مطلوب'],
        account_addressRules: [value => !!value || 'العنوان مطلوب'],
        account_mobile: [
          value => (value && value.length == 11) || 'يجب ان يكون 11 رقم',
          value => /^\d*\.?\d*$/.test(value) || 'يجب ان تكون ارقام',
        ],
        salary: [
          value => !!value || 'مبلغ القسط الكلي مطلوب',
          value => (value >= 1000 && value <= 5000000) || value == 0 || 'يجب ان يكون الرقم بين 1000 و 5000000',
          value => /^\d*\.?\d*$/.test(value) || 'يجب ان تكون ارقام',

          // value => /^($|[^0])/.test(value) || 'يجب ان لا يكتب الصفر في البداية',
        ],
        payment: [
          value => !!value || 'مبلغ الواصل مطلوب',
          value => (value >= 1000 && value <= 5000000) || value == 0 || 'يجب ان يكون الرقم بين 1000 و 5000000',
        ],
        withDraw: [
          value => !!value || 'مبلغ الخصم مطلوب',
          value => (value >= 1000 && value <= 5000000) || value == 0 || 'يجب ان يكون الرقم بين 1000 و 5000000',
        ],
        newPaymentDate: [value => !!value || 'تاريخ الدفعة القادمة مطلوب'],
      },

      teacherData: {},

      classSchoolData: [],

      isPageNotLoading: true,

      account_genderItems: ['ذكر', 'انثى'],

      account_disableItems: [
        { text: 'مفعل', value: false },
        { text: 'متوقف', value: true },
      ],

      account_notificatinItems: [
        { text: 'مفعلة', value: 1 },
        { text: 'متوقفة', value: 0 },
      ],
      menuAccountStartDate: false,
      menuAccountBirthday: false,
      account_payment_typeItems: ['ملاك', 'محاضر'],

      featuredFingerId: 1,

      classLoading: false,

      content_url: null,

      accountImgUrl: null,

      fatherImgUrl: null,

      motherImgUrl: null,

      assistanceImgUrl: null,
    }
  },
  async created() {
    const resultsLocalStorage = JSON.parse(localStorage.getItem('results'))
    this.featuredFingerId = resultsLocalStorage.features_finger_id
    await this.getTeacherDataAxios()
  },

  methods: {
    async getTeacherDataAxios() {
      this.isPageNotLoading = false

      const response = await Api.getOneStudent(this.$route.params.id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
        this.isPageNotLoading = true
      } else if (response.status === 500) {
        this.isPageNotLoading = true
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.isPageNotLoading = true
        this.teacherData = response.data.results
        this.content_url = response.data.content_url
      }
    },

    async submitAdd() {

      const account_img = document.querySelector('#account_img').files[0]

      const father_img = document.querySelector('#father_img').files[0]

      const mother_img = document.querySelector('#mother_img').files[0]

      const assistance_img = document.querySelector('#assistance_img').files[0]

      if (!account_img && !father_img && !mother_img && !assistance_img) {
        this.showDialogfunction("لم يتم تغير اي صورة", '#FF5252')
      } else {
        this.editBtnLoading = true

        const data = {
          id: this.teacherData._id,
          account_img,
          father_img_id: father_img,
          mother_img_id: mother_img,
          assistance_img_id: assistance_img,

          old_account_img: this.teacherData.account_img ? this.teacherData.account_img : null,
          old_father_img: this.teacherData.account_document.father_img_id ? this.teacherData.account_document.father_img_id : null,
          old_mother_img: this.teacherData.account_document.mother_img_id ? this.teacherData.account_document.mother_img_id : null,
          old_assistance_img: this.teacherData.account_document.assistance_img_id ? this.teacherData.account_document.assistance_img_id : null,
        }


        const formData = convertModelToFormData(data)

        const response = await Api.editStudentImages(formData)

        if (response.status === 401) {
          this.editBtnLoading = false
          this.$store.dispatch('submitLogout')
        } else if (response.status === 500) {
          this.editBtnLoading = false
          this.showDialogfunction(response.data.results, '#FF5252')
        } else {
          this.editBtnLoading = false
          this.showDialogfunction(response.data.results, 'primary')
        }
      }


    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    changeAccountImg(event) {
      const file = event.target.files[0]
      this.accountImgUrl = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.accountImgUrl = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.accountImgUrl = null
      }
    },

    changeFatherImg(event) {
      const file = event.target.files[0]
      this.fatherImgUrl = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.fatherImgUrl = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.fatherImgUrl = null
      }
    },

    changeMotherImg(event) {
      const file = event.target.files[0]
      this.motherImgUrl = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.motherImgUrl = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.motherImgUrl = null
      }
    },

    changeAssistanceImg(event) {
      const file = event.target.files[0]
      this.assistanceImgUrl = null
      if (typeof file !== 'undefined' && file !== null) {
        const fileExt = file.name.split('.').pop()
        if (
          fileExt.toLowerCase() === 'jpg' ||
          fileExt.toLowerCase() === 'jpeg' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'png' ||
          fileExt.toLowerCase() === 'gif'
        ) {
          this.assistanceImgUrl = URL.createObjectURL(file)
        } else {
          console.log('error_image_add')
        }
      } else {
        this.assistanceImgUrl = null
      }
    },


    showAccountImg() {
      if (!(this.accountImgUrl)) {
        return this.content_url + this.teacherData.account_img
      } else {
        return this.accountImgUrl
      }

    },

    showFatherImg() {
      if (!(this.fatherImgUrl)) {
        return this.content_url + this.teacherData.account_document.father_img_id
      } else {
        return this.fatherImgUrl
      }

    },

    showMotherImg() {
      if (!(this.motherImgUrl)) {
        return this.content_url + this.teacherData.account_document.mother_img_id
      } else {
        return this.motherImgUrl
      }

    },

    showAssistanceImg() {
      if (!(this.assistanceImgUrl)) {
        return this.content_url + this.teacherData.account_document.assistance_img_id
      } else {
        return this.assistanceImgUrl
      }

    },



    isNumber(evt) {
      const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
      const keyPressed = evt.key
      if (!keysAllowed.includes(keyPressed)) {
        evt.preventDefault()
      }
    },
  },
}
</script>

<style>
.parent_images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 5px;
}

.btn_mobile {
  margin-top: 50px;
}

@media (max-width: 480px) {
  .parent_images {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(1, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 5px;
  }

  .btn_mobile {
    margin-top: 50px;
  }
}
</style>
