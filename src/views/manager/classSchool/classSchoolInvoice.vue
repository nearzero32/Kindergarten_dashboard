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
                <span class="text--primary font-weight-bold text-xl"> {{ results.school_name }} </span>
              </div>
            </div>
            <!-- Right Content -->
            <div>
              <p class="font-weight-medium text-xl text--primary my-3"> {{ responseDB.class_name + "_" +
                  responseDB.leader
              }} </p>
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <div class="d-flex justify-center my-5">
          <qrcode-vue v-if="responseDB._id != null" :value="responseDB._id" :size="size" level="H" />
        </div>
      </v-card>
    </v-col>
    <!-- Right Column: Invoice Action -->
    <v-col cols="12" md="3">
      <v-card>
        <v-card-text>
          <v-btn class="mb-3" color="secondary" block outlined @click="printInvoice"> طباعة </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>



<script>
import api from '@/api/api';
import { mdiCurrencyUsd, mdiSendOutline } from '@mdi/js';
import QrcodeVue from 'qrcode.vue';
// import invoiceStoreModule from '../invoiceStoreModule'
// import InvoiceSidebarSendInvoice from '../InvoiceSidebarSendInvoice.vue'
// import InvoiceSidebarAddPayment from '../InvoiceSidebarAddPayment.vue'

export default {
  components: {
    QrcodeVue,
  },

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
        currencySymbol: " IQD",
        nextPaymentDate: null,
        remainingAll: 0,
        student_name: null,
        service_name: null
      },

      size: 400,

      icons: {
        mdiSendOutline,
        mdiCurrencyUsd,
      },

      results: {},


      billAccountData: {},

      dateString: null,

      responseDB: {
        class_name: "",
        leader: "",
        _id: null
      },

      content_url: null
    }
  },

  watch: {
    '$vuetify.breakpoint': {
      handler() {
        if (this.$vuetify.breakpoint.xs) {
          this.size = 180
        } else {
          this.size = 400
        }
      },
      deep: true,
    },
  },

  async created() {
    this.results = JSON.parse(localStorage.getItem('results'));
    console.log('this.results', this.results);

    this.billAccountData = JSON.parse(localStorage.getItem('studentBillInvoice'));

    const response = await api.getOneClassSchool(this.$route.params.id)

    this.responseDB = response.data.results

    this.content_url = response.data.content_url
  },

  methods: {
    printInvoice() {
      window.print()
    }
  },
  // setup() {
  //   const invoiceData = ref(null)
  //   const paymentDetails = ref({})
  //   // const route = useRoute();

  //   // const isInvoiceSendSidebarActive = ref(false)
  //   // const isAddPaymentSidebarActive = ref(false)

  //   // Invoice Description
  //   // ? Your real data will contain this information
  //   const purchasedProducts = [
  //     {
  //       service_name: 'اقساط',
  //       salaryAmount: 500,
  //       paymentAmount: 450,
  //       discountAmount: 50,
  //       remainingAll: 50,
  //       currencySymbol: "IQD",
  //     },

  //   ]


  //   const billInfo = ref({
  //     "_id": null,
  //     "student_id": null,
  //     "desc": null,
  //     "service_type": null,
  //     "school_id": null,
  //     "is_deleted": null,
  //     "createdAt": null,
  //     "updatedAt": null,
  //     "salaryAmount": null,
  //     "discountAmount": null,
  //     "paymentAmount": null,
  //     "currency": null,
  //     "currencySymbol": " IQD",
  //     "nextPaymentDate": null,
  //     "remainingAll": 0,
  //     "student_name": null,
  //     "service_name": null
  //   });

  //   onMounted(async () => {
  //     // const student_id = route.params.student_id
  //     // console.log('route.params', route.params);
  //     const study_year = JSON.parse(localStorage.getItem('study_year'))

  //     const response = await api.getOneStudentBills({ isDeleted: false, study_year, student_id: 1 })

  //     billInfo.value = response.data.results

  //   });

  //   const results = JSON.parse(localStorage.getItem('results'))


  //   const date = new Date();
  //   const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
  //     .toISOString()
  //     .split("T")[0];


  //   // ————————————————————————————————————
  //   //* ——— Store Registration
  //   // ————————————————————————————————————

  //   const INVOICE_APP_STORE_MODULE_NAME = 'app-invoice'

  //   // Register module
  //   // if (!store.hasModule(INVOICE_APP_STORE_MODULE_NAME)) {
  //   //   store.registerModule(INVOICE_APP_STORE_MODULE_NAME, invoiceStoreModule)
  //   // }

  //   // UnRegister on leave
  //   // onUnmounted(() => {
  //   //   if (store.hasModule(INVOICE_APP_STORE_MODULE_NAME)) store.unregisterModule(INVOICE_APP_STORE_MODULE_NAME)
  //   // })

  //   // ————————————————————————————————————
  //   //* ——— Invoice
  //   // ————————————————————————————————————


  //   const printInvoice = () => {
  //     window.print()
  //   }

  //   return {
  //     invoiceData,
  //     paymentDetails,
  //     purchasedProducts,
  //     results,
  //     dateString,

  //     // invoiceDescription,
  //     printInvoice,

  //     // drawer
  //     //   isInvoiceSendSidebarActive,
  //     //   isAddPaymentSidebarActive,

  //     // themeConfig
  //     appName: themeConfig.app.name,
  //     appLogo: themeConfig.app.logo,

  //     icons: {
  //       mdiSendOutline,
  //       mdiCurrencyUsd,
  //     },
  //   }
  // },
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
