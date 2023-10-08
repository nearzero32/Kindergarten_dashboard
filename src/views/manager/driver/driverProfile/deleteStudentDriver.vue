<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center mb-1 subtitle-4 black--text"> حذف طلاب من السائق </h1>
      <h2 class="text-center subtitle-5 black--text"> ({{ $route.params.name }}) </h2>
      <v-row>
        <v-col md="4" cols="12">
          <div class="d-md-flex">
            <v-btn tile color="#FF5252" class="white--text ml-2 mb-4 mb-md-0 mb-sm-0" :block="isScreenXs"
              @click="deleteStudentToDriver">
              <span>حذف</span>
              <v-icon right> fa-minus </v-icon>
            </v-btn>
            <v-btn tile color="success" :block="isScreenXs" :loading="xlsxData.downloadLoading" @click="handleDownload">
              تحميل اكسل <v-icon right> fa-download </v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-spacer></v-spacer>
        <v-col md="3" sm="3" xs="12">
          <v-text-field v-model="table.search" label="البحث" append-icon="mdi-magnify" single-line hide-details>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table v-model="table.selectedStudent" show-select :loading="table.loading"
            loading-text="جاري التحميل ... الرجاء الانتظار" :headers="headers" :items="driversData"
            :search="table.search" :items-per-page="10" item-key="_id" class="elevation-1" :footer-props="{
              showFirstLastPage: true,
              firstIcon: 'mdi-arrow-collapse-left',
              lastIcon: 'mdi-arrow-collapse-right',
              prevIcon: 'mdi-plus',
              nextIcon: 'mdi-minus',
            }">
            <template v-slot:item.account_division_current="{ item }">
              <span v-if="item.class_name">{{ item.class_name + " (" + item.leader + ")" }}</span>
              <span v-else>--</span>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من حذف العنصر ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogDelete = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="deleteStudentLoading" @click="deleteItemConfirm"> حذف </v-btn>
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
      dialogDelete: false,
      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      deleteStudentLoading: false,

      isScreenXs: false,

      xlsxData: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: `طلاب السائق ${this.$route.params.name}`,
        autoWidth: true,
        bookType: 'xlsx',
      },

      table: {
        loading: false,
        search: null,
        imageUrlForShow: null,
        showImageDailog: false,
        selectedStudent: [],
      },
      headers: [
        {
          text: 'الاسم',
          align: 'start',
          sortable: false,
          value: 'account_name',
        },
        { text: 'الهاتف', sortable: false, value: 'account_mobile1' },
        { text: 'الجنس', sortable: false, value: 'account_gender' },
        { text: 'الصف والشعبة', sortable: false, value: 'account_division_current' },
      ],
      driversData: [],
    }
  },

  watch: {
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

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      const response = await Api.getDriverStudent(this.$route.params.id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.driversData = response.data.results
      }
    },
    deleteStudentToDriver() {
      if (!this.table.selectedStudent.length) {
        this.showDialogfunction('يجب اختيار طالب', '#FF5252')
      } else {
        this.dialogDelete = true
      }
    },
    async deleteItemConfirm() {
      this.dialogDelete = true
      this.deleteStudentLoading = true
      const response = await Api.removeDriverStudent(this.$route.params.id, this.table.selectedStudent)

      if (response.status === 401) {
        this.dialogDelete = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.dialogDelete = false
        this.deleteStudentLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.dialogDelete = false
        this.deleteStudentLoading = false
        this.getData()
        this.showDialogfunction('تم الحذف', 'primary')
      }
    },
    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    handleDownload() {
      this.xlsxData.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['الاسم', 'الهاتف', 'الجنس', 'الصف', 'الشعبة']
        const filterVal = ['account_name', 'account_mobile1', 'account_gender', 'class_name', 'leader']

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
