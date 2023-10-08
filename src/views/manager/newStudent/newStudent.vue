<template>
  <div class="team">
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> طلبات التسجيل الجديدة </h1>
        <v-row class="mt-5">
          <v-col md="3" xs="12">
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
              <template slot="item.account_id" slot-scope="props"> {{ (tableOptions.page - 1) *
                  tableOptions.itemsPerPage + props.index + 1
              }} </template>
              <template v-slot:item.account_salary="{ item }">
                <v-chip color="primary" dark> {{ item.account_salary }} </v-chip>
              </template>
              <template v-slot:item.account_img="{ item }">
                <img v-if="item.account_img" class="teacher_image_table" :src="$store.state.FileUrl + item.account_img"
                  alt width="50" height="50" @click="showImage(item.account_img)" />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="ml-2" v-bind="attrs" size="20" v-on="on" @click="agree(item)">
                      fa-check </v-icon>
                  </template>
                  <span>الموافقة على طلب التسجيل</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="#FF5252" v-bind="attrs" size="20" v-on="on" @click="deleteItem(item)"> mdi-delete
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
    <!-- image Teacher dialog -->
    <v-dialog v-model="table.showImageDailog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">عرض الصورة</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form>
              <v-row class="justify-center">
                <img :src="this.$store.state.FileUrl + table.imageUrlForShow" alt width="300" height="200" />
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="table.showImageDailog = false"> الغاء </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- image Teacher dialog -->
    <!-- Edit dialog -->
    <v-dialog v-model="agreeDaliog.open" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">الموافقة على تسجيل الطالب</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="agreeDaliog.validForm">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="agreeData.salary" label="مبلغ القسط الكلي" :rules="editRules.salary" outlined
                    required suffix="IQD" @keypress="isNumber($event)"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="agreeData.payment" label="الواصل" :rules="editRules.payment" outlined required
                    suffix="IQD" @keypress="isNumber($event)"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="agreeData.withDraw" label="الخصم" :rules="editRules.withDraw" outlined required
                    suffix="IQD" @keypress="isNumber($event)"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-menu v-model="menuAccountBirthday" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="agreeData.newPaymentDate" :rules="editRules.newPaymentDate" dense
                        label="تاريخ الدفعة القادمة" outlined prepend-icon="mdi-calendar" clearable readonly
                        v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="agreeData.newPaymentDate" @input="menuAccountBirthday = false">
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="agreeDaliog.open = false"> الغاء </v-btn>
          <v-btn color="primary white--text" :loading="agreeDaliog.loading" :disabled="!agreeDaliog.validForm"
            @click="submitAgree"> اضافة وتعديل </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit dialog -->
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
        payment: [
          value => !!value || 'مبلغ الواصل مطلوب',
          value => (value >= 1000 && value <= 5000000) || value == 0 || 'يجب ان يكون الرقم بين 1000 و 5000000',
        ],
        withDraw: [
          value => !!value || 'مبلغ الخصم مطلوب',
          value => (value >= 1000 && value <= 5000000) || value == 0 || 'يجب ان يكون الرقم بين 1000 و 5000000',
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
          { text: 'الصورة', value: 'account_img', sortable: false },
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
    getTeacherDataAxios() {
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
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .get(`studentNew/getStudent/${page}/${itemsPerPage}`)
        .then(Response => {
          this.table.loading = false
          this.table.teacherData = Response.data.results
          this.table.totalTeacherData = Response.data.count
        })
        .catch(error => {
          this.table.loading = false
          console.log('error', error)
        })
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

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.deleteItemLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .delete(`delete/deleteAccount/${this.deletedItem.account_id}`)
        .then(Response => {
          if (Response.data.error == false) {
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

    agree(item) {
      this.editedItem = { ...item }
      this.agreeDaliog.open = true
    },

    submitAgree() {
      this.agreeDaliog.open = true
      this.agreeDaliog.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .post('studentNew/accept', {
          account_id: this.editedItem.account_id,
          salary: +this.agreeData.salary,
          payment: +this.agreeData.payment,
          discount: +this.agreeData.withDraw,
          date: this.agreeData.newPaymentDate,
        })
        .then(Response => {
          this.agreeDaliog.loading = false
          if (Response.data.error == false) {
            this.agreeDaliog.open = false
            this.agreeData.salary = null
            this.agreeData.payment = null
            this.agreeData.withDraw = null
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
