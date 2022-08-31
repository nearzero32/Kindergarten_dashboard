<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> التعديل </h1>
      <h2 class="text-center subtitle-5 black--text"> ({{ $route.params.name }}) </h2>
      <v-container class="px-15">
        <v-form v-model="isFormValid">
          <v-row v-if="isPageNotLoading" class="mt-5">
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
            <!-- gender -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.account_gender" :rules="Rules.account_genderRules"
                :items="account_genderItems" dense item-text="text" item-value="value" label="الجنس" outlined>
              </v-select>
            </v-col>
            <!-- vacations -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_max_vacation" dense label="عدد الاجازات المسموح بها خلال السنة"
                outlined></v-text-field>
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
            <!-- notifications -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.isAccountCanSendNotification" :items="account_notificatinItems" dense
                item-text="text" item-value="value" label="الاشعارات" outlined></v-select>
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
                outlined suffix="IQD"></v-text-field>
            </v-col>
            <!-- paymentType -->
            <!-- <v-col
              md="4"
              sm="6"
              cols="12"
            >
              <v-select
                v-model="teacherData.account_payment_type"
                :rules="Rules.account_payment_typeRules"
                :items="account_payment_typeItems"
                dense
                item-text="text"
                item-value="value"
                label="المسمى الوظيفي"
                outlined
              ></v-select>
            </v-col> -->
            <!-- cardNumber -->
            <v-col md="4" sm="6" cols="12">
              <v-text-field v-model="teacherData.account_card_number" dense
                label="رقم بطاقة البصمة التابعة للاستاذ (اختياري)" outlined></v-text-field>
            </v-col>
            <!-- divisions -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.account_division" :rules="Rules.account_divisionRules"
                :items="classSchoolData" dense :item-text="
                  (item) => item.class_name + ' - ' + item.leader
                " item-value="_id" label="الصفوف" outlined multiple>
              </v-select>
            </v-col>
            <!-- subjects -->
            <v-col md="4" sm="6" cols="12">
              <v-select v-model="teacherData.account_subject" :rules="Rules.account_divisionRules" :items="subjectsData"
                dense item-text="subject_name" item-value="_id" label="المواد" outlined multiple>
              </v-select>
            </v-col>
          </v-row>
          <v-row v-else class="mt-10 mb-2 d-flex justify-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-row>
        </v-form>
        <div v-if="isPageNotLoading" class="d-flex justify-center mt-2">
          <v-btn :loading="editBtnLoading" :disabled="!isFormValid" color="primary" @click="submitEdit()"> تعديل
          </v-btn>
        </div>
      </v-container>
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
    </v-card>
  </div>
</template>
<script>
import Api from '@/api/api'

export default {
  data() {
    return {
      isFormValid: false,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      account_payment_typeItems: ['ملاك', 'محاضر', 'مدرس مساعد', 'مدير', 'معاون', 'اداري'],

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
        account_divisionRules: [value => !!value || 'الصف مطلوب'],
        account_salaryRules: [
          value => !!value || 'الراتب مطلوب',
          value => (value >= 1000 && value <= 5000000) || value == 0 || 'يجب ان يكون الرقم بين 1000 و 5000000',
          value => /^\d*\.?\d*$/.test(value) || 'يجب ان تكون ارقام',

          // value => /^($|[^0])/.test(value) || 'يجب ان لا يكتب الصفر في البداية',
        ],
        account_payment_typeRules: [value => !!value || 'المسمى الوظيفي مطلوب'],
        account_start_dateRules: [value => !!value || 'تاريخ بدء العمل مطلوب'],
        account_max_vacation: [
          value => !!value || 'الاجازات مطلوبة',
          value => /^\d*\.?\d*$/.test(value) || 'يجب ان تكون ارقام',
          // value => /^\d*\.?\d*$/.test(value) || value === 0 || 'يجب ان تكون ارقام',
        ],
        account_mobile: [
          value => (value && value.length === 11) || 'يجب ان يكون 11 رقم',
          value => /^\d*\.?\d*$/.test(value) || 'يجب ان تكون ارقام',
        ],
      },

      editBtnLoading: false,

      teacherData: {},

      classSchoolData: [],

      subjectsData: [],

      isPageNotLoading: true,

      account_genderItems: ['ذكر', 'انثى'],

      account_disableItems: [
        { text: 'مفعل', value: false },
        { text: 'متوقف', value: true },
      ],

      account_notificatinItems: [
        { text: 'مفعلة', value: true },
        { text: 'متوقفة', value: false },
      ],

      menuAccountStartDate: false,

      menuAccountBirthday: false,
    }
  },
  async created() {
    await this.getClassSchool()
    await this.getSubject()
    await this.getTeacherDataAxios()
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

    async submitEdit() {
      this.editBtnLoading = true

      const response = await Api.editTeachers({
        _id: this.teacherData._id,
        account_name: this.teacherData.account_name,
        account_mobile: this.teacherData.account_mobile,
        account_birthday: this.teacherData.account_birthday,
        account_card_number: this.teacherData.account_card_number,
        account_gender: this.teacherData.account_gender,
        isAccountDisabled: this.teacherData.isAccountDisabled,
        account_address: this.teacherData.account_address,
        account_max_vacation: this.teacherData.account_max_vacation,
        isAccountCanSendNotification: this.teacherData.isAccountCanSendNotification,
        account_salary: this.teacherData.account_salary,
        account_division: this.teacherData.account_division,
        account_subject: this.teacherData.account_subject,
      })

      if (response.status === 401) {
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
      const response = await Api.getClassSchool()

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.classSchoolData = response.data.results
      }
    },

    async getSubject() {
      const response = await Api.getSubjectWithoutFeatures()
      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.subjectsData = response.data.results
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
