<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> اضافة طالب </h1>
        <v-form v-model="isFormValid">
          <v-row class="mt-5">
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
            <!-- email -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_email" :rules="Rules.account_emailRules" dense label="الايميل"
                outlined></v-text-field>
            </v-col>
            <!-- password -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_password_show" :rules="Rules.account_passwordRules" dense
                label="الرمز" outlined></v-text-field>
            </v-col>
            <!-- birthday -->
            <!-- <v-col md="4" sm="6" cols="12">
              <v-menu v-model="menuAccountBirthday" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="teacherData.account_birthday" :rules="Rules.account_birthdayRules" dense
                    label="المواليد" outlined clearable readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="teacherData.account_birthday" @input="menuAccountBirthday = false">
                </v-date-picker>
              </v-menu>
            </v-col> -->
            <!-- notifications -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.account_notification" :items="account_notificatinItems" dense
                item-text="text" item-value="value" label="الاشعارات" outlined></v-select>
            </v-col>
            <!-- isAccountDisabled -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.isAccountDisabled" :items="account_disableItems" dense item-text="text"
                item-value="value" label="الحساب" outlined></v-select>
            </v-col>
            <!-- address -->
            <!-- <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_address" :rules="Rules.account_addressRules" dense
                label="العنوان" outlined></v-text-field>
            </v-col> -->
            <!-- cardNumber -->
            <!-- <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_card_number" dense
                label="رقم بطاقة البصمة الاولى (اختياري)" outlined></v-text-field>
            </v-col> -->
            <!-- cardNumber -->
            <!-- <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_card_number_two" dense
                label="رقم بطاقة البصمة الثانية (اختياري)" outlined></v-text-field>
            </v-col> -->
            <!-- division -->
            <!-- <v-col md="4" sm="6" cols="12">
              <v-autocomplete v-model="teacherData.account_division" :items="classSchoolData" :loading="classLoading"
                :item-text="item => item.class_name + ' - ' + item.leader" item-value="_id" clearable
                label="الصف والشعبة" dense outlined></v-autocomplete>
            </v-col> -->
          </v-row>
        </v-form>
        <div class="d-flex justify-center mt-2">
          <v-btn :loading="addBtnLoading" :disabled="!isFormValid" color="primary" @click="submitAdd()"> اضافة </v-btn>
          <v-btn class="mr-5" @click="cancelAdd()"> الغاء </v-btn>
        </div>
      </v-card>
    </v-container>
    <!--- Dialog for show info to user-->
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
import { sha512 } from 'js-sha512'

export default {
  data() {
    return {
      isFormValid: false,

      classLoading: false,

      menuNewPaymentDate: false,

      Rules: {
        account_nameRules: [value => !!value || 'الاسم مطلوب'],
        account_emailRules: [
          value => !!value || 'الايميل مطلوب',

          // (value) =>
          //   (value && value.length > 4) || "خمسة احرف او ارفام على الاقل",
          v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'يجب ادخال عنوان بريد الكتروني صالح',
        ],
        account_passwordRules: [
          value => !!value || 'الرمز مطلوب',
          value => (value && value.length > 5) || 'ستة احرف او ارفام على الاقل',
        ],
        account_birthdayRules: [value => !!value || 'يوم الميلاد مطلوب'],
        account_genderRules: [value => !!value || 'الجنس مطلوب'],
        account_addressRules: [value => !!value || 'العنوان مطلوب'],
        account_mobile: [
          value => (value && value.length === 11) || 'يجب ان يكون 11 رقم',
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

      account_notificatinItems: [
        { text: 'مفعلة', value: 1 },
        { text: 'متوقفة', value: 0 },
      ],

      account_disableItems: [
        { text: 'مفعل', value: false },
        { text: 'متوقف', value: true },
      ],

      classSchoolData: [],

      // account_genderItems: ['ذكر', 'انثى'],

      menuAccountStartDate: false,

      menuAccountBirthday: false,

      dialogDelete: false,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      teacherData: {
        account_name: null,
        account_mobile: null,
        account_email: null,
        account_password_show: null,
        account_birthday: null,
        // account_gender: null,
        account_card_number: null,
        account_card_number_two: null,
        account_max_vacation: null,
        account_start_date: null,
        account_notification: 1,
        isAccountDisabled: true,
        account_address: null,
        account_division: this.$route.params.class_school_id,
        salary: null,
        payment: null,
        discount: null,
        newPaymentDate: null,
      },

      addBtnLoading: false,

      featuredFingerId: 1,
    }
  },
  async created() {
    const resultsLocalStorage = JSON.parse(localStorage.getItem('results'))
    this.featuredFingerId = resultsLocalStorage.features_finger_id

    await this.getClassSchool()
  },
  methods: {
    async getClassSchool() {
      this.classLoading = true
      const response = await Api.getClassSchool()
      if (response.status === 401) {
        this.classLoading = false
        this.$store.dispatch('submitLogout')
        this.classLoading = false
      } else if (response.status === 500) {
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.classLoading = false
        this.classSchoolData = response.data.results
      }
    },

    async submitAdd() {
      this.addBtnLoading = true
      const study_year = JSON.parse(localStorage.getItem('study_year'))

      const response = await Api.addStudent({
        account_name: this.teacherData.account_name,
        account_email: this.teacherData.account_email,
        account_mobile: this.teacherData.account_mobile,
        account_password: sha512(this.teacherData.account_password_show),
        account_password_show: this.teacherData.account_password_show,
        account_birthday: this.teacherData.account_birthday,
        account_address: this.teacherData.account_address,
        account_card_number: this.teacherData.account_card_number,
        account_card_number_two: this.teacherData.account_card_number_two,
        class_school_id: this.$route.params.class_school_id,
        isAccountDisabled: this.teacherData.isAccountDisabled,
        study_year: study_year,
      })

      if (response.status === 401) {
        this.addBtnLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.addBtnLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.addBtnLoading = false
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    cancelAdd() {
      window.history.back()
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
