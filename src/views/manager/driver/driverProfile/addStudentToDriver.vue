<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text"> اضافة طلاب للسائق </h1>
      <h2 class="text-center subtitle-5 black--text"> ({{ $route.params.name }}) </h2>
      <v-row class="mt-5">
        <v-col md="4" cols="12">
          <v-btn tile color="primary" @click="addStudentToDriver"> اضافة <v-icon right> fa-plus </v-icon>
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col md="4" cols="12">
          <div class="d-flex flex-row">
            <v-text-field v-model="table.search" label="البحث" outlined dense @keyup.enter="search()"></v-text-field>
            <button class="search-btn" @click="search()">
              <v-icon style="font-size: 18px; color: white"> fa-search </v-icon>
            </button>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table v-model="table.selectedStudent" :headers="table.headers"
            loading-text="جاري التحميل ... الرجاء الانتظار" :items="table.teacherData" :options.sync="tableOptions"
            show-select item-key="_id" :server-items-length="table.totalTeacherData" :loading="table.loading"
            class="elevation-1" :footer-props="{
              itemsPerPageOptions: [10, 50, 100],
            }">
            <template slot="item._id" slot-scope="props"> {{ props.index + 1 }} </template>
            <template v-slot:item.account_division_current="{ item }"> {{ item.account_division_current.class_name +
            "__" + item.account_division_current.leader }} </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من اضافة الطلاب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogDelete = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="addStudentToDriverBtnLoading" @click="addItemConfirm"> اضافة </v-btn>
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

      addStudentToDriverBtnLoading: false,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },
      tableOptions: {},
      table: {
        search: null,
        totalTeacherData: 0,
        teacherData: [],
        loading: true,
        selectedStudent: [],
        headers: [
          {
            text: '#',
            align: 'start',

            value: '_id',
          },
          {
            text: 'الاسم',
            align: 'start',
            sortable: false,
            value: 'account_name',
          },
          { text: 'الهاتف', sortable: false, value: 'account_mobile' },
          { text: 'الجنس', sortable: false, value: 'account_gender' },
          { text: 'الصف والشعبة', sortable: false, value: 'account_division_current' },
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
    '$route.query.search': {
      handler(search) {
        this.table.search = search
        this.getTeacherDataAxios(search)
      },
      deep: true,
      immediate: true,
    },
  },
  async mounted() {
    this.getTeacherDataAxios()
  },
  methods: {
    async getTeacherDataAxios() {
      let { search } = this.table
      this.table.loading = true
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

      const response = await Api.getStudentsThatNotBelongToDriver(page, itemsPerPage, search)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.table.teacherData = response.data.results.data
        this.table.totalTeacherData = response.data.results.count
      }
    },
    search() {
      this.$router.replace(
        {
          query: { search: this.table.search },
        },
        () => { },
      )
    },
    addStudentToDriver() {
      if (!this.table.selectedStudent.length) {
        this.showDialogfunction('يجب اختيار طالب', '#FF5252')
      } else {
        this.dialogDelete = true
      }
    },
    async addItemConfirm() {
      this.addStudentToDriverBtnLoading = true
      const response = await Api.addDriverStudent(this.$route.params.id, this.table.selectedStudent)

      if (response.status === 401) {
        this.addStudentToDriverBtnLoading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.addStudentToDriverBtnLoading = false
        this.dialogDelete = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.addStudentToDriverBtnLoading = false
        this.dialogDelete = false
        this.getTeacherDataAxios()
        this.showDialogfunction('تمت الاضافة', 'primary')
      }
    },
    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
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
</style>
