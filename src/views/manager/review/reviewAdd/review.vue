  <template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text"> التقييم </h1>
        <h3 class="text-center mb-3 subtitle-4 black--text"> {{ $route.params.class_school_name }} </h3>
        <v-row class="mt-2">
          <v-col md="3" cols="6">
            <v-btn tile color="primary" class="ml-2" :loading="editLoading" :disabled="!isFormValid"
              @click="submitEdit()"> اضافة التقييم <v-icon right> fa-plus </v-icon>
            </v-btn>
          </v-col>
          <v-col md="3" cols="6">
            <v-btn tile class="ml-2" color="success" :loading="xlsxData.downloadLoading" @click="handleDownload"> تحميل
              اكسل <v-icon right> fa-download </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-form v-model="isFormValid">
          <v-row v-if="!loading" class="mt-5">
            <v-col cols="12" md="12" class="absence__border">
              <v-row>
                <v-col cols="2">
                  <span>اسم الطالب</span>
                </v-col>
                <v-col cols="2" class="text-center">
                  <span>المستوى العملي</span>
                </v-col>
                <v-col cols="2" class="text-center">
                  <span>المستوى السلوكي</span>
                </v-col>
                <v-col cols="2" class="text-center">
                  <span>المستوى الحضوري</span>
                </v-col>
                <v-col cols="2" class="text-center">
                  <span>التوجيه</span>
                </v-col>
                <v-col cols="2" class="text-center">
                  <span>الملاحظات</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col v-for="(student, index) in studentsData" :key="student.account_id" cols="12" md="12"
              class="absence__border">
              <v-row>
                <v-col cols="2">
                  <!-- <v-icon class="ml-2" color="#B9F6CA"
                    v-if="student.reviews.review_scientific && student.reviews.review_behavior && student.reviews.review_guidance">
                    fa-check-circle</v-icon>
                  <v-icon class="ml-2" color="#FF8A80" v-else> fa-times-circle</v-icon> -->
                  <span class="student_name">{{ index + 1 + '-' + student.account_name }}</span>
                </v-col>
                <v-col cols="2">
                  <v-select v-model="student.reviews.review_scientific" dense outlined
                    :items="selectItems" label="اختيار"></v-select>
                </v-col>
                <v-col cols="2">
                  <v-select v-model="student.reviews.review_behavior" dense outlined
                    :items="selectItems" label="اختيار"></v-select>
                </v-col>
                <v-col cols="2">
                  <v-select v-model="student.reviews.review_presence" dense outlined
                    :items="selectItems" label="اختيار" @change="changeStudentReviewPresence($event)"></v-select>
                </v-col>
                <v-col cols="2">
                  <v-textarea v-model="student.reviews.review_guidance" outlined dense rows="2"
                    label="التوجيه (اختياري)">
                  </v-textarea>
                </v-col>
                <v-col cols="2">
                  <v-textarea v-model="student.reviews.review_note" outlined dense rows="2" label="الملاحظة (اختياري)">
                  </v-textarea>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <div v-else class="d-flex justify-center pa-10">
            <v-progress-circular indeterminate color="amber"></v-progress-circular>
          </div>
        </v-form>
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

      selectItems: ['ممتاز', 'جيد جدا', 'جيد', 'مقبول', 'ضعيف'],

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
        exams_name: [value => !!value || 'التقييم مطلوب'],
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

  mounted() {
    this.getStudentData()
  },

  methods: {
    async getStudentData() {
      this.loading = true

      const study_year = JSON.parse(localStorage.getItem('study_year'))
      const response = await Api.getAccountReviewClassSchool(
        this.$route.params.class_school_id,
        this.$route.params.date,
        study_year,
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
      this.editLoading = true
      const data = (await this.modifyDataToUpload(this.studentsData)).data
      const reviewIds = (await this.modifyDataToUpload(this.studentsData)).reviewIds

      const response = await Api.addReview(data, reviewIds)

      if (response.status === 401) {
        this.editLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.editLoading = false
        this.showDialogfunction(response.data.results, '#FF8A80')
      } else {
        this.editLoading = false
        this.getStudentData()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    async modifyDataToUpload(reviewData) {
      let modifiedData = {
        data: [],
        reviewIds: [],
      }
      const study_year = JSON.parse(localStorage.getItem('study_year'))
      for await (const iterator of reviewData) {
        if (iterator.reviews.review_behavior) {
          modifiedData.data.push({
            review_for_account: iterator._id,
            review_behavior: iterator.reviews.review_behavior,
            review_scientific: iterator.reviews.review_scientific,
            review_presence: iterator.reviews.review_presence,
            review_note: iterator.reviews.review_note ? iterator.reviews.review_note : null,
            review_date: this.$route.params.date,
            review_study_year: study_year,
            review_guidance: iterator.reviews.review_guidance ? iterator.reviews.review_guidance : null,
          })
          modifiedData.reviewIds.push(iterator.reviews._id)
        }
      }

      return modifiedData
    },

    handleDownload() {
      this.xlsxData.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // console.log(this.studentsData)
        const tHeader = ['الاسم', 'المستوى العملي', 'المستوى السلوكي', 'المستوى الحضوري', 'التوجيه', 'الملاحظات']
        const filterVal = [
          'account_name',
          'reviews.review_scientific',
          'reviews.review_presence',
          'reviews.review_behavior',
          'reviews.review_guidance',
          'reviews.review_note',
        ]

        // const { list } = this
        const data = this.formatJson(filterVal, this.studentsData)
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

    changeStudentReviewPresence(event) {
      console.log('event', event)
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
