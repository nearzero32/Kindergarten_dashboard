<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text">
          تفاصيل اقساط الطالب
        </h1>
        <h2 class="text-center subtitle-5 black--text">
          ({{ $route.params.name }})
        </h2>
        <v-row class="mt-5">
          <v-col
            md="12"
            xs="12"
          >
            <v-btn
              tile
              color="primary"
              :disabled="salaryExsits"
              @click="dialogSalary.open = true"
            >
              اضافة اقساط
              <v-icon right>
                fa-hand-holding-usd
              </v-icon>
            </v-btn>
            <v-btn
              tile
              class="mr-2"
              color="primary"
              :disabled="!salaryExsits"
              @click="paymentDialog.open = true"
            >
              تسديد
              <v-icon right>
                fa-money-bill-wave
              </v-icon>
            </v-btn>

            <v-btn
              tile
              class="mr-2 white--text"
              color="#EF5350"
              :disabled="!salaryExsits || discountExsits"
              @click="discountDailog.open = true"
            >
              خصم
              <v-icon right>
                fa-minus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="table.headers"
              loading-text="جاري التحميل ... الرجاء الانتظار"
              :items="table.teacherData"
              :loading="table.loading"
              class="elevation-1"
              :footer-props="{
                itemsPerPageOptions: [10, 50, 100],
              }"
            >
              <template v-slot:item.salary_student_type="{ item }">
                <span v-if="item.salary_student_type === 'salary'">
                  قسط
                </span>
                <span v-else-if="item.salary_student_type === 'payment'">
                  تسديد
                </span>
                <span v-else>
                  خصم
                </span>
              </template>
              <template v-slot:item.salary_student_salary="{ item }">
                <v-chip
                  v-if="item.salary_student_salary < 0"
                  color="#FF5252"
                  dark
                >
                  {{ item.salary_student_salary }}
                </v-chip>
                <v-chip
                  v-else-if="item.salary_student_salary == 0"
                  color="primary"
                  dark
                >
                  -
                </v-chip>

                <v-chip
                  v-else
                  color="primary"
                  dark
                >
                  {{ item.salary_student_salary }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      class="ml-2"
                      v-bind="attrs"
                      size="20"
                      v-on="on"
                      @click="editItem(item)"
                    >
                      fa-edit
                    </v-icon>
                  </template>
                  <span>تعديل</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <div class="d-flex justify-space-between align-center mt-3">
          <p class="mt-5">
            * تاريخ الدفعة القادمة
            <span
              v-if="table.teacherData[0]"
              style="color: blue"
            >{{ table.teacherData[0].salary_student_next_payment }}</span>
            <span
              v-else
              style="color: blue"
            > </span>
          </p>

          <h2>المتبقي : <span>{{ allSalary }}</span></h2>
          <!-- <v-btn
            color="primary"
            @click="goToDetailsPage"
          >
            التفاصيل
          </v-btn> -->
        </div>
      </v-card>
    </v-container>
    <!-- dialogSalary -->
    <v-dialog
      v-model="dialogSalary.open"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">اضافة قسط للطالب</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="dialogSalary.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="AddingData.salary"
                    label="المبلغ"
                    :rules="rules"
                    outlined
                    required
                    @keypress="isNumber($event)"
                  ></v-text-field>
                </v-col>
                <!-- nextPayment -->
                <v-col
                  cols="12"
                >
                  <v-menu
                    v-model="menuSalary"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="AddingData.salaryNextPayment"
                        :rules="rulesNextPayment"
                        label="تاريخ الدفعة القادمة"
                        outlined
                        prepend-icon="mdi-calendar"
                        clearable
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="AddingData.salaryNextPayment"
                      @input="menuSalary = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialogSalary.open = false"
          >
            الغاء
          </v-btn>
          <v-btn
            color="primary"
            :loading="dialogSalary.loading"
            :disabled="!dialogSalary.isFormValid"
            @click="salaryConfirm"
          >
            اضافة
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialogSalary -->

    <!-- paymentDialog -->
    <v-dialog
      v-model="paymentDialog.open"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">اضافة تسديد</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="paymentDialog.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="AddingData.payment"
                    label="المبلغ"
                    :rules="rules"
                    outlined
                    required
                    @keypress="isNumber($event)"
                  ></v-text-field>
                </v-col>
                <!-- nextPayment -->
                <v-col
                  cols="12"
                >
                  <v-menu
                    v-model="menuPayment"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="AddingData.paymentNextPayment"
                        :rules="rulesNextPayment"
                        label="تاريخ الدفعة القادمة"
                        outlined
                        prepend-icon="mdi-calendar"
                        clearable
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="AddingData.paymentNextPayment"
                      @input="menuPayment = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="paymentDialog.open = false"
          >
            الغاء
          </v-btn>
          <v-btn
            color="primary"
            :loading="paymentDialog.loading"
            :disabled="!paymentDialog.isFormValid"
            @click="submitPayment"
          >
            اضافة
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- paymentDialog -->

    <!-- discountDailog -->
    <v-dialog
      v-model="discountDailog.open"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">اضافة خصم</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="discountDailog.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="AddingData.discount"
                    label="المبلغ"
                    :rules="rules"
                    outlined
                    required
                    @keypress="isNumber($event)"
                  ></v-text-field>
                </v-col>
                <!-- nextPayment -->
                <v-col
                  cols="12"
                >
                  <v-menu
                    v-model="menuDiscount"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="AddingData.discountNextPayment"
                        :rules="rulesNextPayment"
                        label="تاريخ الدفعة القادمة"
                        outlined
                        prepend-icon="mdi-calendar"
                        clearable
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="AddingData.discountNextPayment"
                      @input="menuDiscount = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="discountDailog.open = false"
          >
            الغاء
          </v-btn>
          <v-btn
            color="primary"
            :loading="discountDailog.loading"
            :disabled="!discountDailog.isFormValid"
            @click="submitDiscount"
          >
            اضافة
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- withDraw dialog -->

    <!--- Dailog for show info to user-->
    <v-dialog
      v-model="dialogData.open"
      max-width="500px"
    >
      <v-toolbar
        :color="dialogData.color"
        dense
      ></v-toolbar>
      <v-card>
        <v-card-title class="headline justify-center">
          {{
            dialogData.bodyText
          }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialogData.open = false"
          >
            تم
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- editDialog -->
    <v-dialog
      v-model="dialogEdit.open"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">التعديل</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="dialogEdit.isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.salary_student_salary"
                    label="المبلغ"
                    :rules="rules"
                    outlined
                    required
                    @keypress="isNumber($event)"
                  ></v-text-field>
                </v-col>
                <!-- nextPayment -->
                <v-col
                  cols="12"
                >
                  <v-menu
                    v-model="menuEdit"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedItem.salary_student_next_payment"
                        :rules="rulesNextPayment"
                        label="تاريخ الدفعة القادمة"
                        outlined
                        prepend-icon="mdi-calendar"
                        clearable
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="editedItem.salary_student_next_payment"
                      @input="menuEdit = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialogEdit.open = false"
          >
            الغاء
          </v-btn>
          <v-btn
            color="primary"
            :loading="dialogEdit.loading"
            :disabled="!dialogEdit.isFormValid"
            @click="editItemConform"
          >
            تعديل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- editDialog -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      depositRules: {
        salary_amount: [value => !!value || 'المبلغ مطلوب'],
      },

      allSalary: 0,

      AddingData: {
        salary: null,
        salaryNextPayment: null,
        payment: null,
        paymentNextPayment: null,
        discount: null,
        discountNextPayment: null,
      },

      editData: {
        amount: null,
        nextPayment: null,
      },

      dialogEdit: {
        open: false,
        isFormValid: false,
        loading: false,
      },

      menuSalary: false,
      menuPayment: false,
      menuDiscount: false,
      menuEdit: false,

      editedItem: {},

      rules: [
        value => !!value || 'المبلغ مطلوبة',
        value => /^\d*\.?\d*$/.test(value) || 'يجب ان تكون ارقام',

        // value => /^($|[^0])/.test(value) || 'يجب ان لا يكتب الصفر في البداية',
        value => (value >= 1000 && value <= 5000000) || value == 0 || 'يجب ان يكون الرقم بين 1000 و 5000000',
      ],

      rulesNextPayment: [value => !!value || 'تاريخ الدفعة القادمة مطلوبة'],

      salaryExsits: false,

      discountExsits: false,

      withDrawtItem: {
        salary_amount: null,
        salary_description: '',
      },

      paymentDialog: {
        open: false,
        loading: false,
        isFormValid: false,
      },

      discountDailog: {
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
            value: 'salary_student_type',
          },
          { text: 'المبلغ', sortable: false, value: 'salary_student_salary' },
          { text: 'السنة الدراسية', sortable: false, value: 'salary_student_study_year' },
          { text: 'تاريخ الدفعة القادمة', sortable: false, value: 'salary_student_next_payment' },
          { text: 'التاريخ', sortable: false, value: 'created_at' },
          { text: 'العمليات', value: 'actions', sortable: false },
        ],
      },
    }
  },
  async mounted() {
    this.getTeacherDataAxios()
  },
  methods: {
    getTeacherDataAxios() {
      this.table.loading = true

      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .get(`salaryStudent/${this.$route.params.id}`)
        .then(Response => {
          this.isSalaryExsits(Response.data.results)
          this.table.loading = false
          this.table.teacherData = Response.data.results
          this.table.totalTeacherData = Response.data.count
          this.allSalary = Response.data.salary_all
        })
        .catch(error => {
          this.table.loading = false
          console.log('error', error)
        })
    },

    salaryConfirm() {
      this.dialogSalary.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('salaryStudent', {
          salary_student_account_id: this.$route.params.id,
          salary_student_salary: this.AddingData.salary,
          salary_student_next_payment: this.AddingData.salaryNextPayment,
          salary_student_type: 'salary',
        })
        .then(Response => {
          this.dialogSalary.loading = false
          if (Response.data.error === false) {
            this.dialogSalary.open = false
            this.getTeacherDataAxios()
            this.AddingData.salary = null
            this.AddingData.salaryNextPayment = null
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

    submitPayment() {
      this.paymentDialog.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('salaryStudent', {
          salary_student_account_id: this.$route.params.id,
          salary_student_salary: -this.AddingData.payment,
          salary_student_next_payment: this.AddingData.paymentNextPayment,
          salary_student_type: 'payment',
        })
        .then(Response => {
          this.paymentDialog.loading = false
          if (Response.data.error === false) {
            this.paymentDialog.open = false
            this.getTeacherDataAxios()
            this.AddingData.payment = null
            this.AddingData.paymentNextPayment = null
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.paymentDialog.open = false
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.paymentDialog.open = false
          this.paymentDialog.loading = false
          this.showDialogfunction('حدث خطأ يرجى المحاولة مجددا', '#FF5252')
          console.log('error', error)
        })
    },

    submitDiscount() {
      this.discountDailog.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('salaryStudent', {
          salary_student_account_id: this.$route.params.id,
          salary_student_salary: -this.AddingData.discount,
          salary_student_next_payment: this.AddingData.discountNextPayment,
          salary_student_type: 'discount',
        })
        .then(Response => {
          this.discountDailog.loading = false
          if (Response.data.error === false) {
            this.discountDailog.open = false
            this.getTeacherDataAxios()
            this.AddingData.discount = null
            this.AddingData.discountNextPayment = null
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.discountDailog.open = false
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.discountDailog.open = false
          this.discountDailog.loading = false
          this.showDialogfunction('حدث خطأ يرجى المحاولة مجددا', '#FF5252')
          console.log('error', error)
        })
    },

    isSalaryExsits(list) {
      // eslint-disable-next-line no-restricted-syntax
      for (const iterator of list) {
        if (iterator.salary_student_type === 'salary') {
          this.salaryExsits = true
        }
        if (iterator.salary_student_type === 'discount') {
          this.discountExsits = true
        }
      }
    },

    isNumber(evt) {
      const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-']
      const keyPressed = evt.key
      if (!keysAllowed.includes(keyPressed)) {
        evt.preventDefault()
      }
    },

    editItem(item) {
      this.editedItem = { ...item }
      this.editedItem.salary_student_salary = Math.abs(this.editedItem.salary_student_salary)
      this.dialogEdit.open = true
    },

    editItemConform() {
      const amount =
        this.editedItem.salary_student_type === 'salary'
          ? this.editedItem.salary_student_salary
          : -this.editedItem.salary_student_salary

      this.dialogEdit.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.$http
        .put('salaryStudent', {
          salary_student_salary: amount,
          salary_student_next_payment: this.editedItem.salary_student_next_payment,
          salary_student_type: this.editedItem.salary_student_type,
          salary_student_id: this.editedItem.salary_student_id,
          salary_student_account_id: this.editedItem.salary_student_account_id,
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
