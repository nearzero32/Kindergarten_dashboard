<template>
  <div class="book">
    <div class="page">
      <!-- Header -->
      <div>
        <!-- Left Content -->
        <div>
          <div class="d-flex align-center">
            <img
              :src="results.content_url + results.school_logo"
              style="max-height: 100px; max-width: 100px; border-radius: 10%; margin: 0 5px 0 10px"
              alt="logo"
              contain
            />
            <span class="text--primary font-weight-bold text-xl"> {{ results.school_name }} </span>
          </div>
          <h2 style="margin-top: 30px">اهلا بكم في {{ results.school_name }}</h2>
          <h2>يرجى تفعيل التطبيق عن طريق تصوير ال QR</h2>
          <div class="my-3" style="text-align: center">
            <img src="@/assets/img/qr.jpg" style="height: 75px; width: 75px" />
          </div>
          <h2>لاجهزة ابل والاندرويد</h2>
          <h2>بعدها ادخال ايميل والرمز الخاص بالطالب</h2>
          <br />
          <img
            v-if="item.account_img"
            :src="results.content_url + item.account_img"
            style="max-height: 100px; max-width: 100px; border-radius: 10%; margin: 0 5px 0 10px"
            alt="logo"
            contain
          />
          <h2>الأسم: {{ item.account_name }}</h2>
          <h2>العنوان: {{ item.account_address }}</h2>
          <h2>البريد الألكتروني: {{ item.account_email }}</h2>
          <h2>رقم الهاتف: {{ item.account_mobile }}</h2>
          <h2>الراتب: {{ item.account_salary }}</h2>
        </div>
        <!-- Right Content -->
      </div>
    </div>
    <!-- Right Column: Invoice Action -->
    <!-- <v-col cols="12" md="3">
          <v-card>
            <v-card-text>
              <v-btn class="mb-3" color="secondary" block outlined @click="printInvoice"> طباعة </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row> -->
  </div>
</template>



<script>
import { mdiCurrencyUsd, mdiSendOutline } from '@mdi/js'

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

      item: {
        account_email: null,
        account_name: null,
        account_password: null,
      },

      icons: {
        mdiSendOutline,
        mdiCurrencyUsd,
      },

      results: {},

      billAccountData: {},

      dateString: null,

      responseDB: [],

      statistic: {
        currency: 'IQD',
        currencySymbol: ' IQD',
        discount: null,
        payment: null,
        salary: null,
        remaining: null,
      },
    }
  },

  async created() {
    this.results = JSON.parse(localStorage.getItem('results'))

    this.item = JSON.parse(localStorage.getItem('printOneTeacher'))

    this.printInvoice()
  },

  methods: {
    printInvoice() {
      window.print()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@core/preset/preset/apps/invoice.scss';

body {
  margin: 0;
  padding: 0;
  background-color: #fafafa;
  font: 12pt 'Tahoma';
}

* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.page {
  width: 21cm;
  min-height: 29.7cm;
  padding: 2cm;
  margin: 1cm auto;
  border: 1px #d3d3d3 solid;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.subpage {
  padding: 1cm;
  border: 5px red solid;
  height: 256mm;
  outline: 2cm #ffeaea solid;
}

@page {
  size: A4;
  margin: 0;
}

@media print {
  .page {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}

// @media print {
//   .v-application {
//     background: none !important;
//   }

//   .app-navigation-menu,
//   .v-app-bar,
//   .v-footer,
//   .product-buy-now,
//   .app-invoice-preview.row .col-12:last-of-type {
//     display: none !important;
//   }

//   .app-invoice-preview.row .col-12:first-child {
//     max-width: 100% !important;
//     flex: 1 !important;
//   }

//   .v-main,
//   .app-content-container {
//     padding: 0px !important;
//   }

//   .v-card {
//     box-shadow: none !important;
//   }

//   .app-invoice-preview {

//     .invoice-header,
//     .payment-details,
//     .invoice-total {
//       &.d-flex {
//         flex-direction: row !important;
//       }
//     }
//   }
// }
</style>
