<template>
  <div class="team">
    <v-row class="mb-5" v-if="account_type === 'manager'">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1">
                {{ numberWithComma(statistic.salary ? statistic.salary : 0) + statistic.currencySymbol }}
              </h2>
              <span>المبلغ الكلي</span>
            </div>

            <v-icon size="30" color="primary" class="rounded-0">
              {{ icons.mdiCashMultiple }}
            </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1">
                {{ numberWithComma(statistic.payment ? statistic.payment : 0) + statistic.currencySymbol }}
              </h2>
              <span>المدفوعات</span>
            </div>

            <v-icon size="30" color="secondary" class="rounded-0">
              fa-coins
            </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1">
                {{ numberWithComma(statistic.discount ? statistic.discount : 0) + statistic.currencySymbol }}
              </h2>
              <span>الخصم</span>
            </div>

            <v-icon size="30" color="warning" class="rounded-0">
              fa-cash-register
            </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text class="d-flex align-center justify-space-between pa-4">
            <div>
              <h2 class="font-weight-semibold mb-1">
                {{ numberWithComma(statistic.remaining ? statistic.remaining : 0) + statistic.currencySymbol }}
              </h2>
              <span>المتبقي</span>
            </div>

            <v-icon size="40" color="error" class="rounded-0">
              {{ icons.mdiCash }}
            </v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="primary-shade--light pa-3">
      <h1 class="text-center mb-3 subtitle-4 black--text">فواتير الطالب</h1>
      <h3 class="text-center mb-3 subtitle-5 black--text">{{ $route.params.student_name }}</h3>

      <v-row>
        <v-col md="2" cols="12">
          <v-menu v-model="menuStartDate" :close-on-content-click="false" :nudge-right="40"
            transition="scale-transition" offset-y min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="tableModifier.start_date" dense label="من" outlined clearable readonly
                v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="tableModifier.start_date" @input="menuStartDate = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col md="2" cols="12">
          <v-menu v-model="menuEndDate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
            offset-y min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="tableModifier.end_date" dense label="الى" outlined clearable readonly
                v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="tableModifier.end_date" @input="menuEndDate = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col md="3" sm="3" cols="12">
          <v-text-field v-model="table.search" label="البحث" append-icon="mdi-magnify" single-line hide-details>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table :loading="table.loading" loading-text="جاري التحميل ... الرجاء الانتظار" :headers="headers"
            :items="driversData" :search="table.search" :items-per-page="10" item-key="class_school_id"
            class="elevation-1" :footer-props="{
              showFirstLastPage: true,
            }">
            <template slot="item._id" slot-scope="props"> {{ props.index + 1 }} </template>
            <template v-slot:item.service_name="{ item }">
              <a @click="showBillsDetails(item._id, item.service_name)">{{ item.service_name }}</a>
            </template>
            <template v-slot:item.salaryAmount="{ item }">
              {{ numberWithComma(item.salaryAmount) }}
            </template>
            <template v-slot:item.paymentAmount="{ item }">
              {{ numberWithComma(item.paymentAmount) }}
            </template>
            <template v-slot:item.discountAmount="{ item }">
              {{ numberWithComma(item.discountAmount) }}
            </template>
            <template v-slot:item.remainingAll="{ item }">
              {{ numberWithComma(item.remainingAll) }}
            </template>
            <!-- <template v-slot:item.date="{ item }">
              {{ getDateString(item.date) }}
            </template> -->
            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="#FDD835" class="ml-2" v-bind="attrs" size="20" v-on="on" @click="printPage(item)">
                    fa-print
                  </v-icon>
                </template>
                <span>طباعة</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
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
import studentBillsApi from '@/api/student_bills'
import numberWithComma from '@/constant/number'
import { mdiCash, mdiCashMultiple } from '@mdi/js'

export default {
  data() {
    return {
      account_type: null,

      menuStartDate: false,

      menuEndDate: false,

      tableModifier: {
        start_date: null,
        end_date: null,
      },

      icons: {
        mdiCashMultiple,
        mdiCash,
      },

      servicesData: [],

      serviceLoading: false,

      studentsData: [],

      studentLoading: false,

      addDialog: {
        open: false,
        isFormValidAdd: false,
        saveLoading: false,
        loading: false,
      },

      menuDate: false,

      nextPaymentDisable: false,

      rules: {
        student_id: [value => !!value || 'اسم الطالب مطلوب'],
        service_type: [value => !!value || 'الخدمة مطلوبة'],
        salaryAmount: [value => !!value || 'المبلغ مطلوب'],
        type: [value => !!value || 'نوع الفاتورة مطلوب'],
        date: [value => !!value || 'تاريخ انشاء الفاتورة مطلوب'],

        // next_payment: [value => !!value || 'تاريخ الدفعة القادمة مطلوب'],
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      table: {
        loading: false,
        search: null,
      },

      dialogEdit: {
        open: false,
        isFormValid: false,
        loading: false,
      },

      statistic: {
        currency: 'IQD',
        currencySymbol: ' IQD',
        discount: null,
        payment: null,
        salary: null,
        remaining: null,
      },

      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: '_id',
        },
        { text: 'نوع الخدمة', sortable: false, value: 'service_name' },
        { text: 'تاريخ انشاء الفاتورة', sortable: false, value: 'date' },
        { text: 'المبلغ الكلي', sortable: false, value: 'salaryAmount' },
        { text: 'المبلغ المدفوع', sortable: false, value: 'paymentAmount' },
        { text: 'الخصم', sortable: false, value: 'discountAmount' },
        { text: 'المتبقي', sortable: false, value: 'remainingAll' },
        { text: 'العملة', sortable: false, value: 'currencySymbol' },
        { text: 'تاريخ الدفعة القادمة', sortable: false, value: 'nextPaymentDate' },
        { text: 'الملاحظات', sortable: false, value: 'desc' },
        { text: 'العمليات', value: 'actions', sortable: false },
      ],
      driversData: [],
      deleteItemLoading: false,
      dialogDelete: false,
    }
  },

  watch: {
    'addData.salaryAmount': {
      handler() {
        this.salaryPlusDiscountAmountChange()
        this.paymentChange()
      },
      // deep: true,
    },
    'addData.paymentAmount': {
      handler() {
        this.salaryPlusDiscountAmountChange()
        this.paymentChange()
      },
      // deep: true,
    },
    'addData.discountAmount': {
      handler() {
        this.salaryPlusDiscountAmountChange()
        this.paymentChange()
      },
      // deep: true,
    },
    'addData.remainingAmount': {
      handler() {
        if (this.addData.remainingAmount <= 0) {
          this.nextPaymentDisable = true
          this.addData.next_payment = null
        } else {
          this.nextPaymentDisable = false
        }
      },
      // deep: true,
    },
    'tableModifier.start_date': {
      handler() {
        this.getData()
      },
      // deep: true,
    },

    'tableModifier.end_date': {
      handler() {
        this.getData()
      },
      // deep: true,
    },
  },

  mounted() {
    this.getData()
    this.account_type = JSON.parse(localStorage.getItem('results')).account_type
  },

  methods: {
    async getData() {
      this.table.loading = true

      const study_year = JSON.parse(localStorage.getItem('study_year'))

      const response = await studentBillsApi.get({
        isDeleted: false,
        start_date: this.tableModifier.start_date,
        end_date: this.tableModifier.end_date,
        study_year,
        student_id: this.$route.params.studentId,
      })

      this.statistic = response.data.statistic

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction('حصلت مشكلة يرجى المحاولة مجددا', '#FF5252')
      } else {
        this.table.loading = false
        this.driversData = response.data.results
      }
    },

    showBillsDetails(id, name) {
      this.$router.push(
        `/studentBills/showBills/student_id/${this.$route.params.studentId}/student_name/${this.$route.params.studentName}/showDetails/id/${id}/name/${name}`,
      )
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    getDateString(isoDate) {
      let date = new Date(isoDate)
      const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]

      return dateString
    },

    printPage(item) {
      // let routeData = this.$router.resolve({ name: 'studentBillInvoice', params: { student_id: item.student_id, student_name: item.student_name, student_mobile: item.student_name, student_class: (item.account_division_current.class_name + ' - ' + item.account_division_current.leader) } });

      let routeData = this.$router.resolve({ name: 'studentBillDetailsInvoice' })

      window.open(routeData.href, '_blank')

      localStorage.setItem('studentBillDetailsInvoice', JSON.stringify(item))

      // router.push('studentBillInvoice')
    },

    isNumber(evt) {
      const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
      const keyPressed = evt.key
      if (!keysAllowed.includes(keyPressed)) {
        evt.preventDefault()
      }
    },

    numberWithComma,
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
</style>
