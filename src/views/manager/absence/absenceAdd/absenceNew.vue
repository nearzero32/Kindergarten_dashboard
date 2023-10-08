<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text">
          الغيابات
        </h1>
        <h3 class="text-center mb-3 subtitle-4 black--text">
          {{ $route.params.class_school_name }}
        </h3>

        <v-row class="mt-2">
          <v-col md="3" sm="3" xs="12" align-self="center">
            <div class="d-md-flex">
              <v-btn tile color="primary" class="ml-2" :loading="editLoading" @click="submitEdit()">
                تعديل الغيابات
                <v-icon right>
                  fa-edit
                </v-icon>
              </v-btn>
              <v-btn tile class="ml-2" color="success" :loading="xlsxData.downloadLoading" @click="handleDownload">
                تحميل اكسل
                <v-icon right>
                  fa-download
                </v-icon>
              </v-btn>
              <v-btn color="#E57373" dark class="ml-2 white--text" @click="changeAllToAbsence()">
                {{ changeAllToAbsenceInstanse.btnText }}
                <v-icon right>
                  {{ changeAllToAbsenceInstanse.btnIcon }}
                </v-icon>
              </v-btn>

              <v-btn color="#006064" dark class="ml-2 white--text" @click="changeAllToPresence()">
                {{ changeAllToPresenceInstanse.btnText }}
                <v-icon right>
                  {{ changeAllToPresenceInstanse.btnIcon }}
                </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-form v-if="!loading" v-model="isFormValid">
          <v-row class="mt-5">
            <v-col v-for="student in studentsData" :key="student.account_id" cols="12">
              <v-row align="center" justify="center" style="border: 1px solid #DDD">
                <v-col cols="3">
                  <div>
                    <span class="student_name d-inline-block mb-3">اسم الطالب: {{ student.account_name }}</span>
                    <v-radio-group v-model="student.absence_type" row>
                      <v-radio label="حضور" color="primary" value="presence"></v-radio>
                      <v-radio label="غياب" color="red" value="absence"></v-radio>
                    </v-radio-group>
                  </div>
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
        <v-card-title class="headline justify-center">
          {{ dialogData.bodyText }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogData.open = false">
            تم
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
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
    getStudentData() {
      this.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.$http
        .get(`student/absence/${this.$route.params.class_school_id}/${this.$route.params.date}`)
        .then(Response => {
          console.log(Response.data)

          this.loading = false
          if (Response.data.error === false) {
            this.studentsData = Response.data.results
          }
        })
        .catch(error => {
          this.loading = false
          console.log(error)
        })
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    async submitEdit() {
      const data = await this.studentsData.filter(p => p.absence_type).map(p => p)

      this.editLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.$http
        .post('student/absence', {
          absence: data,
          date: this.$route.params.date,
          account_division: this.$route.params.class_school_id,
        })
        .then(Response => {
          this.editLoading = false
          if (Response.data.results === 'غير مصرح') {
            this.$store.dispatch('submitLogout')
          } else if (Response.data.error === false) {
            this.showDialogfunction(Response.data.message, 'primary')
          }
        })
        .catch(error => {
          this.editLoading = false
          this.showDialogfunction(Response.data.message, '#FF8A80')
          console.log(error)
        })
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

          const res = {
            account_name: temp.account_name,
            account_mobile: temp.account_mobile,
            absence_type: (temp.absence_type = 'غائب'),
          }

          return res
        })
      this.xlsxData.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
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
</style>

<style scoped>
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
</style>
