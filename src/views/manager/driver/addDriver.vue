<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> اضافة سائق </h1>
        <v-form v-model="isFormValid">
          <v-row class="mt-5">
            <!-- name -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_name" :rules="Rules.account_nameRules" dense label="الاسم"
                outlined></v-text-field>
            </v-col>
            <!-- mobile -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_mobile" dense label="الهاتف" outlined></v-text-field>
            </v-col>
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
            <!-- gender -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.account_gender" :items="account_genderItems"
                :rules="Rules.account_genderRules" dense item-text="text" item-value="value" label="الجنس" outlined>
              </v-select>
            </v-col>
            <!-- birthday -->
            <v-col md="4" sm="6" cols="12">
              <v-menu v-model="menuAccountBirthday" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="teacherData.account_birthday" :rules="Rules.account_birthdayRules" dense
                    label="المواليد" outlined clearable readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="teacherData.account_birthday" @input="menuAccountBirthday = false">
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- accountDisable -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.isAccountDisabled" :items="account_disableItems" dense item-text="text"
                item-value="value" label="الحساب" outlined></v-select>
            </v-col>
            <!-- address -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_address" :rules="Rules.account_addressRules" dense
                label="العنوان" outlined></v-text-field>
            </v-col>
            <!-- salary -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_salary" :rules="Rules.account_salaryRules" dense label="الراتب"
                outlined></v-text-field>
            </v-col>
            <!-- startDate -->
            <v-col md="4" sm="6" cols="12">
              <v-menu v-model="menuAccountStartDate" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="teacherData.account_start_date" :rules="Rules.account_start_dateRules" dense
                    label="تاريخ بدء العمل" outlined clearable readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="teacherData.account_start_date" @input="menuAccountStartDate = false">
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- vacations -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_max_vacation" :rules="Rules.account_max_vacationRules" dense
                label="عدد الاجازات المسموح بها خلال السنة" outlined></v-text-field>
            </v-col>
            <!-- accountCarType -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_car_type" dense label="نوع السيارة (اختياري)" outlined>
              </v-text-field>
            </v-col>
            <!-- accountCarColor -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_car_color" dense label="لون السيارة (اختياري)" outlined>
              </v-text-field>
            </v-col>
            <!-- accountCarNumber -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_car_number" dense label="رقم السيارة (اختياري)" outlined>
              </v-text-field>
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
import Api from '@/api/api'
import rand_pass from '@/constant/rand_pass'
import { sha512 } from 'js-sha512'

export default {
  data() {
    return {
      isFormValid: false,

      Rules: {
        account_nameRules: [value => !!value || 'الاسم مطلوب'],
        account_emailRules: [
          value => !!value || 'الايميل مطلوب',
          value => (value && value.length > 4) || 'خمسة احرف او ارفام على الاقل',
        ],
        account_passwordRules: [
          value => !!value || 'الرمز مطلوب',
          value => (value && value.length > 5) || 'ستة احرف او ارفام على الاقل',
        ],
        account_birthdayRules: [value => !!value || 'يوم الميلاد مطلوب'],
        account_genderRules: [value => !!value || 'الجنس مطلوب'],
        account_addressRules: [value => !!value || 'العنوان مطلوب'],
        account_salaryRules: [value => !!value || 'الراتب مطلوب'],
        account_max_vacationRules: [value => !!value || 'عدد الاجازات مطلوب'],
        account_start_dateRules: [value => !!value || 'تاريخ بدء العمل مطلوب'],
      },

      account_disableItems: [
        { text: 'مفعل', value: false },
        { text: 'متوقف', value: true },
      ],

      classSchoolData: [],

      account_genderItems: ['ذكر', 'انثى'],

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
        account_gender: null,
        account_notification: true,
        account_disable: false,
        account_address: null,
        account_salary: null,
        account_start_date: null,
        account_max_vacation: null,
        account_car_type: null,
        account_car_color: null,
        account_car_number: null,
      },
      addBtnLoading: false,
    }
  },

  created() {
    this.teacherData.account_password_show = rand_pass()
  },

  methods: {
    async submitAdd() {
      this.addBtnLoading = true

      const response = await Api.addDriver({
        account_name: this.teacherData.account_name,
        account_password: sha512(this.teacherData.account_password_show),
        account_password_show: this.teacherData.account_password_show,
        account_mobile: this.teacherData.account_mobile,
        account_email: this.teacherData.account_email,
        account_birthday: this.teacherData.account_birthday,
        account_gender: this.teacherData.account_gender,
        isAccountDisabled: this.teacherData.isAccountDisabled,
        account_address: this.teacherData.account_address,
        account_max_vacation: this.teacherData.account_max_vacation,
        account_salary: this.teacherData.account_salary,
        account_start_date: this.teacherData.account_start_date,
        account_car_type: this.teacherData.account_car_type,
        account_car_color: this.teacherData.account_car_color,
        account_car_number: this.teacherData.account_car_number,
      })

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.addBtnLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.addBtnLoading = false
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    rand_pass,

    cancelAdd() {
      window.history.back()
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },
  },
}
</script>
