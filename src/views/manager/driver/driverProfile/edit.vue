<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> تعديل </h1>
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
              <v-text-field v-model="teacherData.account_mobile" dense label="الهاتف" outlined></v-text-field>
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
                  <v-text-field v-model="teacherData.account_birthday" :rules="Rules.account_genderRules" dense
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
            <v-btn color="primary" text @click="dialogData.open = false"> تم </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>
<script>
import Api from '../../../../api/api'

export default {
  data() {
    return {
      isFormValid: false,

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
        account_salaryRules: [value => !!value || 'الراتب مطلوب'],
        account_max_vacationRules: [value => !!value || 'عدد الاجازات مطلوب'],
      },

      editBtnLoading: false,

      teacherData: {},

      classSchoolData: [],

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

      account_payment_typeItems: ['ملاك', 'محاضر'],
    }
  },
  created() {
    this.getTeacherDataAxios()
  },

  methods: {
    async getTeacherDataAxios() {
      this.isPageNotLoading = false

      const response = await Api.getOneDriver(this.$route.params.id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.isPageNotLoading = true
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.isPageNotLoading = true
        this.teacherData = response.data.results
        this.content_url = response.data.content_url
      }
    },
    async submitEdit() {
      this.editBtnLoading = true

      const response = await Api.editDriver({
        _id: this.teacherData._id,
        account_name: this.teacherData.account_name,
        account_mobile: this.teacherData.account_mobile,
        account_birthday: this.teacherData.account_birthday,
        account_gender: this.teacherData.account_gender,
        isAccountDisabled: this.teacherData.isAccountDisabled,
        account_address: this.teacherData.account_address,
        account_max_vacation: this.teacherData.account_max_vacation,
        account_salary: this.teacherData.account_salary,
        account_car_type: this.teacherData.account_car_type,
        account_car_color: this.teacherData.account_car_color,
        account_car_number: this.teacherData.account_car_number,
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
