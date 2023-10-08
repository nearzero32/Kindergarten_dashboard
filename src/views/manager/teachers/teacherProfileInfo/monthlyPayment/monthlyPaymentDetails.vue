<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> تفاصيل الراتب </h1>
        <h2 class="text-center subtitle-5 black--text"> ({{ $route.params.name }}) </h2>
        <v-row class="mt-5">
          <v-col md="12" xs="12">
            <v-btn tile color="primary" @click="dialogSalary.open = true"> تسليم الراتب <v-icon right>
                fa-hand-holding-usd </v-icon>
            </v-btn>
            <v-btn tile class="mr-2" color="primary" @click="depositDialog.open = true"> المكافاة <v-icon right>
                fa-money-bill-wave </v-icon>
            </v-btn>
            <v-btn tile class="mr-2 white--text" color="#EF5350" @click="drawDailog.open = true"> خصم <v-icon right>
                fa-minus </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table :headers="table.headers" loading-text="جاري التحميل ... الرجاء الانتظار"
              :items="table.teacherData" :options.sync="tableOptions" :server-items-length="table.totalTeacherData"
              :loading="table.loading" class="elevation-1" :footer-props="{
                itemsPerPageOptions: [10, 50, 100],
              }">
              <template v-slot:item.salary_amount="{ item }">
                <v-chip v-if="item.salary_type === 'withdraw'" color="#FF5252" dark> {{ item.salary_amount }} </v-chip>
                <v-chip v-else-if="item.salary_type === 'deposit'" color="#80CBC4" dark> {{ item.salary_amount }}
                </v-chip>
                <v-chip v-else color="primary" dark> {{ item.salary_amount }} </v-chip>
              </template>
              <template v-slot:item.salary_type="{ item }">
                <span v-if="item.salary_type === 'end'">تسليم راتب</span>
                <span v-else-if="item.salary_type === 'withdraw'">خصم</span>
                <span v-else>مكافأة</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-if="item.salary_type == 'deposit' || item.salary_type == 'withdraw'" color="primary"
                      class="ml-2" v-bind="attrs" size="20" v-on="on" @click="editItem(item)"> fa-edit </v-icon>
                  </template>
                  <span>تعديل</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <!-- dialogSalary -->
    <v-dialog v-model="dialogSalary.open" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> سيتم تسليم الراتب هل انت متأكد؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogSalary.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="dialogSalary.loading" @click="salaryConfirm"> تسليم </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End dialogSalary -->
    <!-- deposit dialog -->
    <v-dialog v-model="depositDialog.open" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">اضافة مكافأة</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="depositDialog.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="depositItem.salary_amount" label="المبلغ" :rules="rules" outlined required
                    @keypress="isNumber($event)"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="depositItem.salary_description" name="input-7-1" label="السبب" outlined>
                  </v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="depositDialog.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="depositDialog.loading" :disabled="!depositDialog.isFormValid"
            @click="submitDeposit"> اضافة </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- deposit dialog -->
    <!-- withDraw dialog -->
    <v-dialog v-model="drawDailog.open" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">اضافة خصم</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="drawDailog.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="withDrawtItem.salary_amount" label="المبلغ" :rules="rules" outlined required
                    @keypress="isNumber($event)"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="withDrawtItem.salary_description" name="input-7-1" label="السبب" outlined>
                  </v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="drawDailog.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="drawDailog.loading" :disabled="!drawDailog.isFormValid"
            @click="submitWithDraw"> اضافة </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- withDraw dialog -->
    <!-- editDialog -->
    <v-dialog v-model="dialogEdit.open" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">التعديل</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="dialogEdit.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="editedItem.salary_amount" label="المبلغ" :rules="rules" outlined required
                    @keypress="isNumber($event)"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogEdit.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="dialogEdit.loading" :disabled="!dialogEdit.isFormValid"
            @click="editItemConform"> تعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- editDialog -->
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
export default {
  data() {
    return {
      depositRules: {
        salary_amount: [
          [value => !!value || 'المبلغ مطلوب'],
          value => (value >= 1000 && value <= 5000000) || 'يجب ان يكون الرقم بين 1000 و 5000000',
        ],
      },

      rules: [
        value => !!value || 'مبلغ الخصم مطلوب',
        value => (value >= 1000 && value <= 5000000) || 'يجب ان يكون الرقم بين 1000 و 5000000',
      ],

      editedItem: {},

      depositItem: {
        salary_amount: null,
        salary_description: '',
      },

      withDrawRules: {
        salary_amount: [
          [value => !!value || 'المبلغ مطلوب'],
          value => (value >= 1000 && value <= 5000000) || 'يجب ان يكون الرقم بين 1000 و 5000000',
        ],
      },

      withDrawtItem: {
        salary_amount: null,
        salary_description: '',
      },

      dialogEdit: {
        open: false,
        isFormValid: false,
        loading: false,
      },

      depositDialog: {
        open: false,
        loading: false,
        isFormValid: false,
      },

      drawDailog: {
        open: false,
        loading: false,
        isFormValid: false,
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      dialogSalary: {
        open: false,
        loading: false,
      },

      tableOptions: {},

      table: {
        totalTeacherData: 0,
        teacherData: [],
        loading: true,

        headers: [
          {
            text: 'الوصف',
            align: 'start',
            sortable: false,
            value: 'salary_description',
          },
          { text: 'المبلغ', sortable: false, value: 'salary_amount' },
          { text: 'النوع', sortable: false, value: 'salary_type' },
          { text: 'تاريخ البدء', sortable: false, value: 'salary_start_date' },
          { text: 'تاريخ التسليم', sortable: false, value: 'salary_end_date' },
          { text: 'العمليات', sortable: false, value: 'actions' },
        ],
      },
    }
  },
  watch: {
    tableOptions: {
      handler() {
        this.getTeacherDataAxios()
      },
      deep: true,
    },
  },

  // async mounted() {
  //   this.getTeacherDataAxios()
  // },
  methods: {
    async getTeacherDataAxios() {
      this.table.loading = true
      let { page, itemsPerPage } = this.tableOptions

      if (!page) {
        page = 1
      }
      if (!itemsPerPage) {
        itemsPerPage = 10
      }

      const response = await Api.getSalaryTeacher(this.$route.params.id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.table.teacherData = response.data.results
        this.table.totalTeacherData = response.data.count
      }
    },

    salaryConfirm() {
      this.dialogSalary.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('salary/end', {
          account_id: this.$route.params.id,
          salary_start_date: this.$route.params.startDate,
          salary_date: this.$route.params.endDate,
        })
        .then(Response => {
          this.dialogSalary.loading = false
          if (Response.data.error === false) {
            this.dialogSalary.open = false
            this.getTeacherDataAxios()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.dialogSalary.open = false
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.dialogSalary.open = false
          this.dialogSalary.loading = false
          this.showDialogfunction('حدث خطأ يرجى المحاولة مجددا', '#FF5252')
          console.log('error', error)
        })
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    submitDeposit() {
      this.depositDialog.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('teacher/salary/add/reward', {
          salary_account_id: this.$route.params.id,
          salary_amount: this.depositItem.salary_amount,
          salary_description: this.depositItem.salary_description,
          salary_type: 'deposit',
          salary_date: this.$route.params.endDate,
          salary_start_date: this.$route.params.startDate,
        })
        .then(Response => {
          this.depositDialog.loading = false
          if (Response.data.error === false) {
            this.depositDialog.open = false
            this.getTeacherDataAxios()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.depositDialog.open = false
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.depositDialog.open = false
          this.depositDialog.loading = false
          this.showDialogfunction('حدث خطأ يرجى المحاولة مجددا', '#FF5252')
          console.log('error', error)
        })
    },

    submitWithDraw() {
      this.drawDailog.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('teacher/salary/add/reward', {
          salary_account_id: this.$route.params.id,
          salary_amount: -this.withDrawtItem.salary_amount,
          salary_description: this.withDrawtItem.salary_description,
          salary_type: 'withdraw',
          salary_date: this.$route.params.endDate,
          salary_start_date: this.$route.params.startDate,
        })
        .then(Response => {
          this.drawDailog.loading = false
          if (Response.data.error === false) {
            this.drawDailog.open = false
            this.getTeacherDataAxios()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.drawDailog.open = false
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.drawDailog.open = false
          this.drawDailog.loading = false
          this.showDialogfunction('حدث خطأ يرجى المحاولة مجددا', '#FF5252')
          console.log('error', error)
        })
    },

    isNumber(evt) {
      const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
      const keyPressed = evt.key
      if (!keysAllowed.includes(keyPressed)) {
        evt.preventDefault()
      }
    },

    editItem(item) {
      this.editedItem = { ...item }
      this.editedItem.salary_amount = Math.abs(this.editedItem.salary_amount)
      this.dialogEdit.open = true
    },

    editItemConform() {
      this.dialogEdit.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')

      this.$http
        .put('teacher/salary', {
          salary_amount: this.checkSalaryType(this.editedItem),
          salary_id: this.editedItem.salary_id,
        })
        .then(Response => {
          this.dialogEdit.loading = false
          this.dialogEdit.open = false
          if (Response.data.error === false) {
            this.getTeacherDataAxios()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.showDialogfunction(Response.data.results, '#FF8A80')
          }
        })
        .catch(error => {
          this.dialogEdit.loading = false
          this.showDialogfunction('حدث خطأ يرجى المحاولة مجددا', '#FF8A80')
          console.log(error)
        })
    },

    checkSalaryType(items) {
      if (items.salary_type === 'withdraw') {
        return -items.salary_amount
      }

      return items.salary_amount
    },

    // teacher/salary/add/reward
  },
}
</script>

<style scoped>
.teacher_image_table {
  cursor: pointer;
}

a {
  text-decoration: none;
}

/* v-menu {
  top: 229px;
  left: 769px;
} */
</style>
