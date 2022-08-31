<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text"> الغيابات </h1>
        <v-row>
          <v-col md="4" cols="12" align-self="center">
            <v-btn tile color="success" :loading="xlsxData.downloadLoading" @click="handleDownload"> تحميل اكسل <v-icon
                right> fa-download </v-icon>
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
            <v-data-table :loading="table.loading" loading-text="جاري التحميل ... الرجاء الانتظار" :headers="headers"
              :items="driversData" :search="table.search" :items-per-page="10" item-key="_id" class="elevation-1"
              :footer-props="{
                showFirstLastPage: true,
              }">
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
import Api from '../../../../api/api'

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
        filename: 'حضور الاساتذة',
        autoWidth: true,
        bookType: 'xlsx',
      },

      table: {
        loading: false,
        search: null,
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

  methods: {
    async getData() {
      this.table.loading = true
      const study_year = JSON.parse(localStorage.getItem('study_year'))
      const response = await Api.getAbsenceTeacher(study_year)
      if (response.status === 401) {
        this.table.loading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.driversData = response.data.results
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
        // console.log(this.studentsData)
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
