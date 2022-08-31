<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text"> الغيابات </h1>
        <h3 class="text-center mb-3 subtitle-4 black--text"> {{ $route.params.class_school_name }} </h3>
        <v-row class="mt-2">
          <v-col md="3" cols="6">
            <v-btn tile color="primary" class="ml-2" :loading="editLoading" @click="submitEdit()"> تعديل الغيابات
              <v-icon right> fa-edit </v-icon>
            </v-btn>
          </v-col>
          <v-col md="3" cols="6">
            <v-btn tile class="ml-2" color="success" :loading="xlsxData.downloadLoading" @click="handleDownload"> تحميل
              اكسل <v-icon right> fa-download </v-icon>
            </v-btn>
          </v-col>
          <v-col md="3" cols="6">
            <v-btn color="#E57373" dark class="ml-2 white--text" @click="changeAllToAbsence()"> {{
                changeAllToAbsenceInstanse.btnText
            }} <v-icon right> {{ changeAllToAbsenceInstanse.btnIcon }} </v-icon>
            </v-btn>
          </v-col>
          <v-col md="3" cols="6">
            <v-btn color="#006064" dark class="ml-2 white--text" @click="changeAllToPresence()"> {{
                changeAllToPresenceInstanse.btnText
            }} <v-icon right> {{ changeAllToPresenceInstanse.btnIcon }} </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-form v-if="!loading" v-model="isFormValid">
          <v-row class="mt-5">
            <v-col cols="12" md="6" class="absence__border">
              <v-row>
                <v-col cols="8">
                  <span>اسم الطالب</span>
                </v-col>
                <v-col cols="4" class="text-center">
                  <span>الحالة</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="heading__second absence__border">
              <v-row>
                <v-col cols="8">
                  <span>اسم الطالب</span>
                </v-col>
                <v-col cols="4" class="text-center">
                  <span>الحالة</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-for="(student, index) in studentsData" :key="student._id" cols="12" md="6" class="absence__border">
              <v-row>
                <v-col cols="8">
                  <span class="student_name">{{ index + 1 + '-' + student.account_name }}</span>
                </v-col>
                <v-col cols="2">
                  <v-radio-group v-model="student.absence_type" row class="absence__content">
                    <v-radio label="حضور" color="primary" value="presence"></v-radio>
                    <v-radio label="غياب" color="red" value="absence"></v-radio>
                    <v-radio label="اجازة" color="#455A64" value="vacation"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
        <div v-else class="d-flex justify-center pa-10">
          <v-progress-circular indeterminate color="amber"></v-progress-circular>
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
import Api from '../../../../api/api'

export default {
  data() {
    return {
      deleteItemLoading: false,

      dialogDelete: false,

      editedItem: {},

      isFormValid: false,

      changeAllToAbsenceInstanse: {
        isClicked: false,
        btnText: 'تحديد الكل غياب',
        btnIcon: 'fas fa-check',
      },

      changeAllToPresenceInstanse: {
        isClicked: false,
        btnText: 'تحديد الكل حضور',
        btnIcon: 'fas fa-check',
      },

      exam_data: { exams_name: null },

      Rules: {
        exams_name: [value => !!value || 'الاسم مطلوب'],
      },

      editRules: {
        exams_name: [value => !!value || 'الاسم مطلوب'],
      },

      xlsxData: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: `الصف والشعبة(${this.$route.params.class_school_name}) التاريخ (${this.$route.params.date})`,
        autoWidth: true,
        bookType: 'xlsx',
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      editLoading: false,

      deletedItem: {},

      studentsData: [],

      loading: false,
    }
  },

  watch: {
    'changeAllToAbsenceInstanse.isClicked': {
      handler() {
        if (this.changeAllToAbsenceInstanse.isClicked === true) {
          this.changeAllToAbsenceInstanse.btnText = 'الغاء تحديد الكل غياب'
          this.changeAllToAbsenceInstanse.btnIcon = 'fas fa-times'
        } else {
          this.changeAllToAbsenceInstanse.btnText = 'تحديد الكل غياب'
          this.changeAllToAbsenceInstanse.btnIcon = 'fas fa-check'
        }
      },
    },
    'changeAllToPresenceInstanse.isClicked': {
      handler() {
        if (this.changeAllToPresenceInstanse.isClicked === true) {
          this.changeAllToPresenceInstanse.btnText = 'الغاء تحديد الكل حضور'
          this.changeAllToPresenceInstanse.btnIcon = 'fas fa-times'
        } else {
          this.changeAllToPresenceInstanse.btnText = 'تحديد الكل حضور'
          this.changeAllToPresenceInstanse.btnIcon = 'fas fa-check'
        }
      },
    },
  },
  mounted() {
    this.getStudentData()
  },

  methods: {
    async getStudentData() {
      this.loading = true

      const study_year = JSON.parse(localStorage.getItem('study_year'))
      const response = await Api.getAccountAbsenceClassSchool(
        this.$route.params.class_school_id,
        study_year,
        this.$route.params.date,
      )

      if (response.status === 401) {
        this.loading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.loading = false
        this.studentsData = response.data.results
      }
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    async submitEdit() {
      // this.editLoading = true
      const data = (await this.modifyDataToUpload(this.studentsData)).data
      const absenceIds = (await this.modifyDataToUpload(this.studentsData)).absenceIds

      const response = await Api.addAbsence(data, absenceIds)

      if (response.status === 401) {
        this.editLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.editLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.editLoading = false
        this.getStudentData()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    async modifyDataToUpload(data) {
      let modifiedData = {
        data: [],
        absenceIds: [],
      }
      const study_year = JSON.parse(localStorage.getItem('study_year'))
      for await (const iterator of data) {
        if (iterator.absence_type) {
          modifiedData.data.push({
            absence_type: iterator.absence_type,
            absence_for_account_id: iterator._id,
            absence_for_class_school: this.$route.params.class_school_id,
            absence_study_year: study_year,
            absence_date: this.$route.params.date,
          })
          if (iterator.absence_id) {
            modifiedData.absenceIds.push(iterator.absence_id)
          }
        }
      }

      return modifiedData
    },

    async handleDownload() {
      const studentsData = this.studentsData
        .filter(p => p.absence_type)
        .map(item => {
          const temp = { ...item }
          if (temp.absence_type === 'presence') {
            const res = {
              account_name: temp.account_name,
              account_mobile: temp.account_mobile,
              absence_type: (temp.absence_type = 'حاضر'),
            }

            return res
          }
          if (temp.absence_type === 'vacation') {
            const res = {
              account_name: temp.account_name,
              account_mobile: temp.account_mobile,
              absence_type: (temp.absence_type = 'اجازة'),
            }

            return res
          }

          const res = {
            account_name: temp.account_name,
            account_mobile: temp.account_mobile,
            absence_type: (temp.absence_type = 'غائب'),
          }

          return res
        })
      this.xlsxData.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // console.log(this.studentsData)
        const tHeader = ['اسم الطالب', 'الهاتف', 'الحالة']
        const filterVal = ['account_name', 'account_mobile', 'absence_type']

        // const { list } = this
        const data = this.formatJson(filterVal, studentsData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.xlsxData.filename,
          autoWidth: this.xlsxData.autoWidth,
          bookType: this.xlsxData.bookType,
        })
        this.xlsxData.downloadLoading = false
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    changeAllToAbsence() {
      this.changeAllToPresenceInstanse.isClicked = false
      this.changeAllToAbsenceInstanse.isClicked = !this.changeAllToAbsenceInstanse.isClicked
      if (this.changeAllToAbsenceInstanse.isClicked) {
        for (const key in this.studentsData) {
          this.studentsData[key].absence_type = 'absence'
        }
      } else {
        for (const key in this.studentsData) {
          if (this.studentsData[key].absence_type === 'absence') {
            this.studentsData[key].absence_type = null
          }
        }
      }
    },

    changeAllToPresence() {
      this.changeAllToAbsenceInstanse.isClicked = false
      this.changeAllToPresenceInstanse.isClicked = !this.changeAllToPresenceInstanse.isClicked
      if (this.changeAllToPresenceInstanse.isClicked) {
        for (const key in this.studentsData) {
          this.studentsData[key].absence_type = 'presence'
        }
      } else {
        for (const key in this.studentsData) {
          if (this.studentsData[key].absence_type === 'presence') {
            this.studentsData[key].absence_type = null
          }
        }
      }
    },
  },
}
</script>

<style>
.teacher_image_table {
  cursor: pointer;
}

.absence__content .v-messages {
  min-height: 0;
}
</style>

<style scoped>
@media (max-width: 760px) {
  .heading__second {
    display: none;
  }
}

.absence__content {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

.degree_text {
  width: 12px;
  border: red 1px solid;
}

.student_name {
  color: #000;
}

.absence__border {
  border: 1px solid rgb(206, 193, 193);
}
</style>
