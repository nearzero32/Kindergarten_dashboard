<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> التعديل </h1>
      <h2 class="text-center subtitle-5 black--text">({{ $route.params.name }})</h2>
      <v-container class="px-15">
        <v-form v-model="isFormValid">
          <v-row v-if="isPageNotLoading" class="mt-5">
            <!-- name -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_name" :rules="Rules.account_nameRules" dense label="الاسم"
                outlined></v-text-field>
            </v-col>
            <!-- mobile -->
            <!-- <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_mobile" dense label="الهاتف" outlined
                :rules="Rules.account_mobile"></v-text-field>
            </v-col> -->
            <!-- cardNumber -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_card_number" dense
                label="رقم بطاقة البصمة التابعة للطالب (اختياري)" outlined></v-text-field>
            </v-col>
            <!-- password -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_password_show" :rules="Rules.account_passwordRules" dense
                label="الرمز" outlined></v-text-field>
            </v-col>
            <!-- accountDisable -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.isAccountDisabled" :items="account_disableItems" dense item-text="text"
                item-value="value" label="الحساب" outlined></v-select>
            </v-col>
            <!-- divisions -->
            <v-col md="4" sm="6" cols="12">
              <v-autocomplete v-model="teacherData.account_division_current" :items="classSchoolData"
                :loading="classLoading" :item-text="item => item.class_name + ' - ' + item.leader" item-value="_id"
                label="الصف والشعبة" dense outlined></v-autocomplete>
            </v-col>
            <!-- account_mobile1 -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_mobile1" dense label="الهاتف الاول" outlined></v-text-field>
            </v-col>
            <!-- account_mobile2 -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_mobile2" dense label="الهاتف الثاني" outlined></v-text-field>
            </v-col>
            <!-- account_mobile3 -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_mobile3" dense label="الهاتف الثالث" outlined></v-text-field>
            </v-col>
            <!-- account_mobile4 -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_mobile4" dense label="الهاتف الرابع" outlined></v-text-field>
            </v-col>
            <!-- account_home -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_home" dense label="المنزل" outlined></v-text-field>
            </v-col>
            <!-- account_city -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_city" dense label="المحلة" outlined></v-text-field>
            </v-col>
            <!-- account_alley -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_alley" dense label="الزقاق" outlined></v-text-field>
            </v-col>
            <!-- account_nearest_point -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_nearest_point" dense label="اقرب نقطة دالة"
                outlined></v-text-field>
            </v-col>
          </v-row>
          <v-row v-else class="mt-10 mb-2 d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-row>
        </v-form>
        <div v-if="isPageNotLoading" class="d-flex justify-center mt-2">
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
import { sha512 } from 'js-sha512'

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
        required: [value => !!value || 'الحقل مطلوب'],
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
    }
  },
  async created() {
    const resultsLocalStorage = JSON.parse(localStorage.getItem('results'))
    this.featuredFingerId = resultsLocalStorage.features_finger_id
    await this.getClassSchool()
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
      }
    },

    async submitAdd() {
      this.editBtnLoading = true

      const study_year = JSON.parse(localStorage.getItem('study_year'))
      const response = await Api.editStudent({
        _id: this.$route.params.id,
        account_name: this.teacherData.account_name,
        account_mobile1: this.teacherData.account_mobile1,
        account_mobile2: this.teacherData.account_mobile2,
        account_mobile3: this.teacherData.account_mobile3,
        account_mobile4: this.teacherData.account_mobile4,
        account_password: sha512(this.teacherData.account_password_show),
        account_password_show: this.teacherData.account_password_show,
        account_mobile4: this.teacherData.account_mobile4,
        account_home: this.teacherData.account_home,
        account_area: this.teacherData.account_area,
        account_city: this.teacherData.account_city,
        account_alley: this.teacherData.account_alley,
        account_nearest_point: this.teacherData.account_nearest_point,
        account_card_number: this.teacherData.account_card_number,
        isAccountDisabled: this.teacherData.isAccountDisabled,
        account_address: this.teacherData.account_address,
        class_school_id: this.teacherData.account_division_current,
        class_study_year: study_year,
      })

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
    },

    async getClassSchool() {
      this.classLoading = true
      const response = await Api.getClassSchool()

      if (response.status === 401) {
        this.classLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.classLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.classLoading = false
        this.classSchoolData = response.data.results
      }
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
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
.teacher_image_table {
  cursor: pointer;
}
</style>
