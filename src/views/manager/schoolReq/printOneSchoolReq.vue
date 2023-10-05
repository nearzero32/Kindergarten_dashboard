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
            :src="results.content_url + item.student_image"
            style="max-height: 100px; max-width: 100px; border-radius: 10%; margin: 0 5px 0 10px"
            alt="logo"
            contain
          />
          <h2>الأسم: {{ item.student_name }}</h2>
          <h2>العنوان: {{ item.address }}</h2>
          <h2>محلة: {{ item.address_m }} - الزقاق: {{ item.address_z }} - رقم الدار: {{ item.address_d }}</h2>
          <h2>شهادة الأب: {{ item.father_degree }}</h2>
          <h2>وظيفة الأب: {{ item.father_jop }}</h2>
          <h2>هاتف الأب: {{ item.father_phone }}</h2>
          <h2>هل يقيم الطفل مع ابويه: {{ item.is_staying_with_his_fathers ? 'نعم' : 'لا' }}</h2>
          <h2>شهادة الأم: {{ item.mother_degree }}</h2>
          <h2>وظيفة الأم: {{ item.mother_jop }}</h2>
          <h2>هاتف الأم: {{ item.mother_phone }}</h2>
          <h2>اقرب نقطة دالة: {{ item.nearest_landmark }}</h2>
          <h2>الروضة السابقة: {{ item.past_Kindergarten }}</h2>
          <h2>سبب ترك الروضة السابقة: {{ item.past_school_reason }}</h2>
          <h2>عدد الاخوة: {{ item.student_brother_number }}</h2>
          <h2>ترتيب الطالب بين اخوته: {{ item.student_brother_rank }}</h2>
          <h2>الصف: {{ item.student_class }}</h2>
          <h2>مع من يقيم: {{ item.student_staying_with }}</h2>
          <h2>أسم المدرسة: {{ item.school_name }}</h2>
          <h2>تاريخ الميلاد: {{ item.student_birthday }}</h2>
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

    this.item = JSON.parse(localStorage.getItem('printOneSchoolReq'))

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
