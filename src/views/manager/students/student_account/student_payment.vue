<template>
  <div class="team">
    <v-card class="primary-shade--light pa-3">
      <h1 class="text-center mb-3 subtitle-4 black--text"> تسديدات الطالب : {{ $route.params.student_name }} </h1>
      <h3 class="text-center mb-3 subtitle-5 black--text"> الفاتورة: {{ $route.params.name }}</h3>
      <v-row>

        <v-spacer></v-spacer>
        <v-col md="3" sm="3" cols="12">
          <v-text-field v-model="table.search" label="البحث" append-icon="mdi-magnify" single-line hide-details>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table :loading="table.loading" loading-text="جاري التحميل ... الرجاء الانتظار" :headers="headers"
            :items="driversData" :search="table.search" :items-per-page="10" item-key="_id" class="elevation-1"
            :footer-props="{
              showFirstLastPage: true,
            }">
            <template slot="item._id" slot-scope="props"> {{ props.index + 1 }} </template>
            <template v-slot:item.type="{ item }">
              <span v-if="item.type === 'salary'">المبلغ</span>
              <span v-else-if="item.type === 'payment'">تسديد</span>
              <span v-else>خصم</span>
            </template>

            <template v-slot:item.amount="{ item }">
              {{ numberWithComma(item.amount) }}
            </template>
            <template v-slot:item.created_at="{ item }"> {{ item.createdAt }} </template>
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

export default {
  data() {
    return {
      menuNextPaymentEdit: false,

      menuNextPayment: false,

      paymentsType: [
        { text: 'تسديد', value: 'payment' },
        { text: 'خصم', value: 'discount' },
      ],

      rules: {
        name: [value => !!value || 'الاسم مطلوب'],
        amount: [value => !!value || 'المبلغ مطلوب'],
      },

      class_data: {
        selectedClass: null,
        class_school_leader: null,
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

      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: '_id',
        },
        { text: 'المبلغ', sortable: false, value: 'amount' },
        { text: 'النوع', sortable: false, value: 'type' },
        { text: 'تاريخ الدفعة القادمة', sortable: false, value: 'next_payment' },
        { text: 'تاريخ الانشاء', sortable: false, value: 'createdAt' },
        { text: 'الملاحظة', sortable: false, value: 'desc' },
      ],
      driversData: [],
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      this.table.loading = true

      const study_year = JSON.parse(localStorage.getItem('study_year'))

      const response = await studentBillsApi.getPayment({
        isDeleted: false,
        study_year,
        invoice_id: this.$route.params.id,
      })

      let payments = response.data.results.length >= 1 ? response.data.results[0].payments : []
      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction('حصلت مشكلة يرجى المحاولة مجددا', '#FF5252')
      } else {
        this.table.loading = false
        this.driversData = payments
      }
    },

    getDateAndTime(milisecondsDate) {
      let date = new Date(milisecondsDate)

      return date.toLocaleString('en-Us')
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
