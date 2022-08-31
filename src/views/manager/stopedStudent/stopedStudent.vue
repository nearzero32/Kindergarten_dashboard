<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> الطلاب الموقوفين </h1>
        <v-row class="mt-5">
          <v-col md="3" cols="12">
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
            <v-data-table :headers="table.headers" loading-text="جاري التحميل ... الرجاء الانتظار"
              :items="table.teacherData" :options.sync="tableOptions" :server-items-length="table.totalTeacherData"
              :loading="table.loading" class="elevation-1" :footer-props="{
                itemsPerPageOptions: [10, 50, 100],
              }">
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="ml-2" v-bind="attrs" size="20" v-on="on" @click="recover(item)">
                      fa-redo </v-icon>
                  </template>
                  <span>استرجاع</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <!-- recover dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من استرجاع هذا الحساب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogDelete = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="deleteItemLoading" @click="recoverConfirm"> استرجاع </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End recover dailog -->
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
import Api from '../../../api/api'

export default {
  data() {
    return {
      menuAccountBirthday: false,

      isFormValidEditPassword: false,

      agreeDaliog: {
        open: false,
        loading: false,
        validForm: false,
      },
      agreeData: {
        salary: null,
        withDraw: null,
        payment: null,
        newPaymentDate: null,
      },
      deleteItemLoading: false,

      editedItem: {},

      editRules: {
        salary: [
          value => !!value || 'مبلغ القسط الكلي مطلوب',
          value => (value >= 1000 && value <= 5000000) || value == 0 || 'يجب ان يكون الرقم بين 1000 و 5000000',
          value => /^\d*\.?\d*$/.test(value) || 'يجب ان تكون ارقام',

          // value => /^($|[^0])/.test(value) || 'يجب ان لا يكتب الصفر في البداية',
        ],
        newPaymentDate: [value => !!value || 'تاريخ الدفعة القادمة مطلوب'],
      },

      dialogDelete: false,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      deletedItem: {},

      tableOptions: {},

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
            width: 1,
            value: 'account_id',
          },
          {
            text: 'الاسم',
            sortable: false,
            value: 'account_name',
          },
          { text: 'الهاتف', value: 'account_mobile', sortable: false },
          { text: 'الايميل', value: 'account_email', sortable: false },

          {
            text: 'العنوان',
            sortable: false,
            value: 'account_address',
          },
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
    '$route.query.search': {
      handler(search) {
        this.table.search = search
        this.getTeacherDataAxios(search)
      },
      deep: true,

      // immediate: true,
    },
  },

  // async mounted() {
  //   this.getTeacherDataAxios()
  // },
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

      const response = await Api.getStudentsDisabled(page, itemsPerPage, search)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.table.teacherData = response.data.results.data
        this.table.totalTeacherData = response.data.results.count
        this.content_url = response.data.content_url
      }
    },

    showImage(image) {
      this.table.showImageDailog = true
      this.table.imageUrlForShow = image
    },

    search() {
      this.$router.replace(
        {
          query: { search: this.table.search },
        },
        () => { },
      )
    },

    recover(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    async recoverConfirm() {
      this.deleteItemLoading = true

      const response = await Api.restoreDisabledStudent(this.deletedItem._id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.dialogDelete = false
        this.deleteItemLoading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.deleteItemLoading = false
        this.dialogDelete = false
        this.getTeacherDataAxios()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    agree(item) {
      this.editedItem = { ...item }
      this.agreeDaliog.open = true
    },

    submitAgree() {
      this.agreeDaliog.open = true
      this.agreeDaliog.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .put('changePass', {
          account_id: this.editedItem.account_id,
          salary: this.agreeData.salary,
          payment: this.agreeData.payment,
        })
        .then(Response => {
          this.agreeDaliog.loading = false
          if (Response.data.error === false) {
            this.agreeDaliog.open = false
            this.getTeacherDataAxios()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.agreeDaliog.open = false
            this.showDialogfunction(Response.data.results, '#FF5252')
          }
        })
        .catch(error => {
          this.agreeDaliog.loading = false
          this.agreeDaliog.open = false
          this.showDialogfunction(Response.data.results, '#FF5252')
          console.log('error', error)
        })
    },

    goToAddPage() {
      this.$router.push('addTeacher')
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
