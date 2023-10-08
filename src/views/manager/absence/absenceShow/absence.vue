<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text">الغيابات</h1>
        <h3 class="text-center mb-3 subtitle-4 black--text">{{ $route.params.class_school_name }}</h3>
        <v-row>
          <v-col md="4" cols="12" align-self="center">
            <v-btn tile color="success" :loading="xlsxData.downloadLoading" @click="handleDownload">
              تحميل اكسل <v-icon right> fa-download </v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col md="4" cols="12">
            <v-text-field v-model="table.search" label="البحث" append-icon="mdi-magnify" single-line hide-details>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :loading="table.loading"
              loading-text="جاري التحميل ... الرجاء الانتظار"
              :headers="headers"
              :items="driversData"
              :search="table.search"
              :options.sync="tableOptions"
              :server-items-length="table.totalTeacherData"
              item-key="_id"
              class="elevation-1"
              :footer-props="{
                itemsPerPageOptions: [10, 50, 100],
              }"
            >
              <template slot="item._id" slot-scope="props"> {{ props.index + 1 }} </template>
              <template v-slot:item.actions="{ item }">
                <v-btn small color="primary" @click="goToDetails(item._id, item.account_name)"> عرض التفاصيل </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
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
import Api from '@/api/api'

export default {
  data() {
    return {
      isFormValidEditPassword: false,

      EditPasswordDialog: false,

      EditPasswordLoading: false,

      deleteItemLoading: false,

      editedItem: {},

      dialogDelete: false,
      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      xlsxData: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: `${this.$route.params.class_school_name}`,
        autoWidth: true,
        bookType: 'xlsx',
      },
      tableOptions: {},
      table: {
        loading: false,
        search: null,
        totalTeacherData: 0,
        imageUrlForShow: null,
        showImageDailog: false,
      },
      headers: [
        {
          text: '#',
          align: 'start',
          value: '_id',
        },
        {
          text: 'الاسم',
          value: 'account_name',
        },
        { text: 'الهاتف', value: 'account_mobile' },
        { text: 'عدد الغيابات', value: 'absence' },
        { text: 'عدد الحضور', value: 'presence' },
        { text: 'عدد الاجازات', value: 'vacation' },
        { text: 'العمليات', value: 'actions', sortable: false },
      ],
      driversData: [],
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    tableOptions: {
      handler() {
        const resultsLocalStorage = JSON.parse(localStorage.getItem('results'))
        this.featuredFingerId = resultsLocalStorage.features_finger_id
        this.getData()
      },
      deep: true,
    },
    'table.search': {
      handler(search) {
        this.getData(search)
      },
      deep: true,
    },
    '$vuetify.breakpoint': {
      handler() {
        if (this.$vuetify.breakpoint.xs) {
          this.isScreenXs = true
        } else {
          this.isScreenXs = false
        }
      },
      deep: true,
    },
  },
  methods: {
    async getData() {
      this.table.loading = true
      let { search } = this.table
      let { page, itemsPerPage } = this.tableOptions
      if (!search) {
        search = ''
      }

      if (!page) {
        page = 1
      }
      if (!itemsPerPage) {
        itemsPerPage = 10
      }
      const study_year = JSON.parse(localStorage.getItem('study_year'))
      const response = await Api.getAbsenceStudent(
        this.$route.params.class_school_id,
        study_year,
        page,
        itemsPerPage,
        search,
      )
      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.driversData = response.data.results.data
        this.table.totalTeacherData = response.data.results.count
      }
    },

    goToDetails(accountId, accountName) {
      this.$router.push(`/showAbsence/show/details/${accountId}/${accountName}`)
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    handleDownload() {
      this.xlsxData.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['الاسم', 'الهاتف', 'عدد الغيابات', 'عدد الحضور', 'عدد الاجازات']
        const filterVal = ['account_name', 'account_mobile', 'absence', 'presence', 'vacation']

        // const { list } = this
        const data = this.formatJson(filterVal, this.driversData)
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
