<template>
  <v-row class="app-invoice-preview">
    <v-col cols="12" md="9">
      <v-card>
        <!-- Header -->
        <v-card-text class="py-9 px-8">
          <div class="invoice-header d-flex flex-wrap justify-space-between flex-column flex-sm-row">
            <!-- Left Content -->
            <div class="mb-8 mb-sm-0">
              <div class="d-flex align-center mb-6">
                <v-img :src="results.content_url + results.school_logo" max-height="50px" max-width="50px" alt="logo"
                  contain class="me-3" style="border-radius: 10%"></v-img>
                <span class="text--primary font-weight-bold text-xl">
                  {{ results.school_name }}
                </span>
              </div>
              <span class="d-block">اسم الطالب: {{ billAccountData.student_name }}</span>
              <span class="d-block">الصف والشعبة: {{ billAccountData.account_division_current.class_name + " - " +
              billAccountData.account_division_current.leader
              }}</span>
              <span class="d-block">رقم الهاتف: {{ billAccountData.student_mobile }}</span>
            </div>
            <!-- Right Content -->
            <div>
              <!-- <p class="font-weight-medium text-xl text--primary mb-4">
                Invoice #5s545s
              </p> -->
              <p class="mb-2">
                <span>نوع الخدمة: </span>
                <span class="font-weight-semibold">{{ billAccountData.service_name }}</span>
              </p>
              <p class="mb-2">
                <span>تاريخ الاصدار: </span>
                <span class="font-weight-semibold">{{ dateString }}</span>
              </p>
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>


        <!-- Table -->
        <v-simple-table class="purchased-items-table">
          <template v-slot:default>
            <thead>
              <tr>
                <th>
                  نوع العملية
                </th>
                <th>
                  المبلغ
                </th>
                <th>
                  تاريخ الدفعة القادمة
                </th>
                <th>
                  تاريخ الانشاء
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in responseDB" :key="item._id">
                <td class="text-no-wrap">
                  <span v-if="item.type === 'payment'">تسديد</span>
                  <span v-else>خصم</span>
                </td>
                <td class="text-no-wrap">
                  {{ numberWithComma(item.amount) }}
                </td>
                <td>
                  {{ item.next_payment }}
                </td>

                <td>
                  {{ item.createdAt }}
                </td>
                <td>
                  {{ item.currencySymbol }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <!-- Total -->
        <v-card-text class="py-9 px-8">
          <div class="invoice-total d-flex justify-space-between flex-column flex-sm-row">
            <div>
              <table>
                <tr>
                  <td class="pe-16">
                    المبلغ:
                  </td>
                  <th :class="$vuetify.rtl ? 'text-left' : 'text-right'">
                    {{ numberWithComma(billAccountData.salaryAmount) }}
                  </th>
                </tr>
                <tr>
                  <td class="pe-16">
                    المدفوع:
                  </td>
                  <th :class="$vuetify.rtl ? 'text-left' : 'text-right'">
                    {{ numberWithComma(billAccountData.paymentAmount) }}
                  </th>
                </tr>
                <tr>
                  <td class="pe-16">
                    الخصم:
                  </td>
                  <th :class="$vuetify.rtl ? 'text-left' : 'text-right'">
                    {{ numberWithComma(billAccountData.discountAmount) }}
                  </th>
                </tr>
              </table>
              <v-divider class="mt-4 mb-3"></v-divider>
              <table class="w-full">
                <tr>
                  <td class="pe-16">
                    المتبقي:
                  </td>
                  <th :class="$vuetify.rtl ? 'text-left' : 'text-right'">
                    {{ numberWithComma(billAccountData.salaryAmount - (billAccountData.paymentAmount +
                    billAccountData.discountAmount))
                    }}
                  </th>
                </tr>
              </table>
            </div>
            <!-- <div class="mb-2 mb-sm-0">
              <p class="mb-1">
                <span class="font-weight-semibold">المحاسب</span>
              </p>
              <p>{{ results.account_name }}</p>
            </div> -->

          </div>
        </v-card-text>
        <!--
        <v-divider></v-divider>

        <v-card-text class="px-8 py-6">
          <p class="mb-0">
            <span class="font-weight-semibold">Note: </span>
            <span>It was a pleasure working with you and your team. We hope you will keep us in mind for future
              freelance projects. Thank You!</span>
          </p>
        </v-card-text> -->
      </v-card>
    </v-col>

    <!-- Right Column: Invoice Action -->
    <v-col cols="12" md="3">
      <v-card>
        <v-card-text>
          <!-- <v-btn color="primary" class="mb-3" block>
            <v-icon class="me-2" left>
              {{ icons.mdiSendOutline }}
            </v-icon>
            <span>Send Invoice</span>
          </v-btn> -->
          <!-- <v-btn class="mb-3" color="secondary" block outlined>
            Download
          </v-btn> -->
          <v-btn class="mb-3" color="secondary" block outlined @click="printInvoice">
            طباعة
          </v-btn>
          <!-- <v-btn class="mb-3" color="secondary" block outlined>
            Edit Invoice
          </v-btn>
          <v-btn color="success" block>
            <v-icon class="me-2" left>
              {{ icons.mdiCurrencyUsd }}
            </v-icon>
            <span>Add Payment</span>
          </v-btn> -->
        </v-card-text>
      </v-card>
    </v-col>

    <!-- invoice send drawer -->
    <!-- <invoice-sidebar-send-invoice v-model="isInvoiceSendSidebarActive"></invoice-sidebar-send-invoice> -->

    <!-- invoice add payment drawer -->
    <!-- <invoice-sidebar-add-payment v-model="isAddPaymentSidebarActive"></invoice-sidebar-add-payment> -->
  </v-row>
</template>



<script>
import studentBillsApi from '@/api/student_bills'
import numberWithComma from '@/constant/number'
import { mdiCurrencyUsd, mdiSendOutline } from '@mdi/js'
// import invoiceStoreModule from '../invoiceStoreModule'
// import InvoiceSidebarSendInvoice from '../InvoiceSidebarSendInvoice.vue'
// import InvoiceSidebarAddPayment from '../InvoiceSidebarAddPayment.vue'

export default {
  //   components: {
  //     InvoiceSidebarSendInvoice,
  //     InvoiceSidebarAddPayment,
  //   },

  data() {
    return {
      invoiceData: null,
      paymentDetails: {},
      billInfo: {
        _id: null,
        student_id: null,
        desc: null,
        service_type: null,
        school_id: null,
        is_deleted: null,
        createdAt: null,
        updatedAt: null,
        salaryAmount: null,
        discountAmount: null,
        paymentAmount: null,
        currency: null,
        currencySymbol: ' IQD',
        nextPaymentDate: null,
        remainingAll: 0,
        student_name: null,
        service_name: null,
      },

      icons: {
        mdiSendOutline,
        mdiCurrencyUsd,
      },

      results: {},

      billAccountData: {},

      dateString: null,

      responseDB: [],
    }
  },

  async created() {
    this.results = JSON.parse(localStorage.getItem('results'))

    this.billAccountData = JSON.parse(localStorage.getItem('studentBillDetailsInvoice'))
    const study_year = JSON.parse(localStorage.getItem('study_year'))

    const response = await studentBillsApi.getPayment({
      isDeleted: false,
      study_year,
      invoice_id: this.billAccountData._id,
    })
    let payments = response.data.results.length >= 1 ? response.data.results[0].payments : []
    payments.filters
    this.responseDB = await this.getOnlyPaymentAndDiscountOfPayment(payments)

    const date = new Date()

    this.dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
  },

  methods: {
    printInvoice() {
      window.print()
    },

    async getOnlyPaymentAndDiscountOfPayment(payments) {
      let payementsOrginazed = []
      for await (const iterator of payments) {
        if (iterator.type != 'salary') {
          payementsOrginazed.push(iterator)
        }
      }

      return payementsOrginazed
    },

    getDateAndTime(milisecondsDate) {
      let date = new Date(milisecondsDate)

      return date.toLocaleString('en-Us')
    },
    numberWithComma,
  },
}
</script>

<style lang="scss">
@import '~@core/preset/preset/apps/invoice.scss';

@media print {
  .v-application {
    background: none !important;
  }

  .app-navigation-menu,
  .v-app-bar,
  .v-footer,
  .product-buy-now,
  .app-invoice-preview.row .col-12:last-of-type {
    display: none !important;
  }

  .app-invoice-preview.row .col-12:first-child {
    max-width: 100% !important;
    flex: 1 !important;
  }

  .v-main,
  .app-content-container {
    padding: 0px !important;
  }

  .v-card {
    box-shadow: none !important;
  }

  .app-invoice-preview {
    .invoice-header,
    .payment-details,
    .invoice-total {
      &.d-flex {
        flex-direction: row !important;
      }
    }
  }
}
</style>
