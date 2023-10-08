<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> اضافة حساب </h1>
        <v-form v-model="isFormValid">
          <v-row class="mt-5">
            <!-- name -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_name" :rules="Rules.account_nameRules" dense label="الاسم"
                outlined></v-text-field>
            </v-col>
            <!-- mobile -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_mobile" dense label="الهاتف" outlined
                :rules="Rules.account_mobile"></v-text-field>
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
              <v-select v-model="teacherData.account_gender" :items="account_genderItems" dense item-text="text"
                item-value="value" label="الجنس" outlined></v-select>
            </v-col>
            <!-- type -->
            <!-- <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.account_type" :items="account_typeItems" dense item-text="text"
                item-value="value" label="النوع" outlined></v-select>
            </v-col> -->
            <!-- birthday -->
            <v-col md="4" sm="6" cols="12">
              <v-menu v-model="menuAccountBirthday" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y min-width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="teacherData.account_birthday" :rules="Rules.account_birthdayRules" dense
                    label="المواليد" outlined clearable readonly v-bind="attrs" v-on="on">
                  </v-text-field>
                </template>
                <v-date-picker v-model="teacherData.account_birthday" @input="menuAccountBirthday = false">
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- address -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_address" :rules="Rules.account_addressRules" dense
                label="العنوان" outlined></v-text-field>
            </v-col>
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
import adminApi from '@/api/adminApi'
import { sha512 } from 'js-sha512'

export default {
  data() {
    return {
      isFormValid: false,

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
      },

      account_typeItems: [
        { text: 'مدير', value: 'manager' },
        { text: 'سكرتير', value: 'assistance' },
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
        account_password: null,
        account_birthday: null,
        account_gender: 'ذكر',
        account_address: null,
        account_school: this.$route.params.id,

        account_type: 'manager',
      },
      addBtnLoading: false,
    }
  },
  methods: {
    async submitAdd() {
      this.addBtnLoading = true

      this.teacherData.account_password = sha512(this.teacherData.account_password_show)

      const response = await adminApi.addManager(this.teacherData)

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

    cancelAdd() {
      this.$router.back(1)
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
