<template>
  <div>
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center mb-3 subtitle-4 black--text"> تفاصيل الغيابات والحضور </h1>
        <h3 class="text-center mb-3 subtitle-4 black--text"> {{ $route.params.account_name }} </h3>
        <v-row class="mt-5">
          <v-col md="4" cols="12">
            <v-btn tile class="ml-2" color="success" :loading="xlsxData.downloadLoading"
              @click="getAllTeacherDataAxios"> تحميل اكسل <v-icon right> fa-download </v-icon>
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
              <template slot="item.absence_id" slot-scope="props"> {{ ((tableOptions.page - 1) *
                  tableOptions.itemsPerPage + props.index) + 1
              }} </template>
              <template v-slot:item.absence_type="{ item }">
                <v-chip v-if="item.absence_type == 'absence'" color="#E57373" dark> غياب </v-chip>
                <v-chip v-else color="primary" dark> حضور </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="#FF5252" v-bind="attrs" size="20" v-on="on" @click="deleteItem(item)"> fa-trash
                    </v-icon>
                  </template>
                  <span>حذف</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من حذف هذا الحساب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false"> الغاء </v-btn>
          <v-btn color="primary white--text" :loading="deleteItemLoading" @click="deleteItemConfirm"> حذف </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete dailog -->
    <!--- Dailog for show info to user-->
    <v-dialog v-model="dialogData.open" max-width="500px">
      <v-toolbar :color="dialogData.color" dense></v-toolbar>
      <v-card>
        <v-card-title class="headline justify-center"> {{ dialogData.bodyText }} </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1 justify-start" text @click="dialogData.open = false"> تم </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deleteItemLoading: false,

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
        filename: `غيابات الاستاذ ${this.$route.params.account_name}`,
        autoWidth: true,
        bookType: 'xlsx',
      },

      isScreenXs: false,

      deletedItem: {},

      tableOptions: {},

      allTeacherData: [],

      table: {
        search: null,
        totalTeacherData: 0,
        teacherData: [],
        loading: true,
        showImageDailog: false,
        imageUrlForShow: null,

        headers: [
          {
            text: '#',
            align: 'start',
            sortable: false,
            value: 'absence_id',
          },
          {
            text: 'النوع',
            sortable: false,
            value: 'absence_type',
          },
          { text: 'التاريخ', sortable: false, value: 'absence_date' },
          { text: 'تاريخ الانشاء', sortable: false, value: 'absence_created_at' },
          { text: 'العمليات', value: 'actions', sortable: false },
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
    getTeacherDataAxios() {
      this.table.loading = true
      let { page, itemsPerPage } = this.tableOptions

      if (!page) {
        page = 1
      }
      if (!itemsPerPage) {
        itemsPerPage = 10
      }
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('student/absenceStudent', {
          account_id: this.$route.params.account_id,
          page,
          limit: itemsPerPage,
        })
        .then(Response => {
          if (Response.data.results === 'غير مصرح') {
            this.$store.dispatch('submitLogout')
          } else {
            this.table.loading = false
            this.table.teacherData = Response.data.results
            this.table.totalTeacherData = Response.data.count
          }
        })
        .catch(error => {
          this.table.loading = false
          console.log('error', error)
        })
    },

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.deleteItemLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .delete(`student/absenceStudent/${this.deletedItem.absence_id}`)
        .then(Response => {
          if (Response.data.error === false) {
            this.deleteItemLoading = false
            this.dialogDelete = false
            this.getTeacherDataAxios()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.deleteItemLoading = false
          this.dialogDelete = false
          this.showDialogfunction(response.data.results, '#FF5252')
          console.log('error', error)
        })
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    getAllTeacherDataAxios() {
      this.xlsxData.downloadLoading = true

      let { search } = this.table
      let { page } = this.tableOptions
      if (!search) {
        search = ''
      }

      if (!page) {
        page = 1
      }

      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('student/absenceStudent', {
          account_id: this.$route.params.account_id,
          page,
          limit: 100000,
        })
        .then(Response => {
          if (Response.data.results === 'غير مصرح') {
            this.$store.dispatch('submitLogout')
          } else {
            this.allTeacherData = Response.data.results
            this.handleDownload()
          }
        })
        .catch(error => {
          this.xlsxData.downloadLoading = false
          this.showDialogfunction(response.data.results, '#FF5252')
          console.log('error', error)
        })
    },

    async handleDownload() {
      const studentsData = this.allTeacherData
        .filter(p => p.absence_type)
        .map(item => {
          const temp = { ...item }
          if (temp.absence_type === 'presence') {
            const res = {
              absence_created_at: temp.absence_created_at,
              absence_date: temp.absence_date,
              absence_type: (temp.absence_type = 'حضور'),
            }

            return res
          }

          const res = {
            absence_created_at: temp.absence_created_at,
            absence_date: temp.absence_date,
            absence_type: (temp.absence_type = 'غياب'),
          }

          return res
        })
      this.xlsxData.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['النوع', 'التاريخ', 'تاريخ الانشاء']
        const filterVal = ['absence_type', 'absence_date', 'absence_created_at']

        // const { list } = this
        const data = this.formatJson(filterVal, studentsData)
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

<style scoped>
.teacher_image_table {
  cursor: pointer;
}

a {
  text-decoration: none;
}

.search-btn {
  width: 49px;
  height: 40px;
  padding: 10px;
  background: #2196f3;
  font-size: 17px;
  border: 1px solid grey;
  border-right: none;
  cursor: pointer;
  line-height: 100%;
  border-radius: 7px;
}

table.v-table tbody td {
  color: black;
}
</style>
