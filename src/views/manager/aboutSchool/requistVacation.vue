<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text mb-5">
        طلب الاجازة
      </h1>

      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="table.headers"
            loading-text="جاري التحميل ... الرجاء الانتظار"
            :items="table.teacherData"
            :options.sync="tableOptions"
            :server-items-length="table.totalTeacherData"
            :loading="table.loading"
            class="elevation-1"
            :footer-props="{
              itemsPerPageOptions: [10, 50, 100],
            }"
          >
            <template
              slot="item.requist_vacation_id"
              slot-scope="props"
            >
              {{
                (tableOptions.page - 1) * tableOptions.itemsPerPage +
                  props.index +
                  1
              }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="item.requist_vacation_accepted == 0"
                color="warning"
                class="ml-2"
                size="20"
                @click="EditPassword(item)"
              >
                الانتظار
              </v-btn>
              <v-chip
                v-else-if="item.requist_vacation_accepted == 1"
                color="primary"
              >
                تمت الموافقة
              </v-chip>
              <v-chip
                v-else
                color="#FF8A80"
              >
                تم الرفض
              </v-chip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
    <!-- Edit dialog -->
    <v-dialog
      v-model="EditPasswordDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">الرد على الطلب</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="responseSelect"
                  :items="response"
                  item-text="text"
                  item-value="value"
                  label="الرد"
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="EditPasswordDialog = false"
          >
            الغاء
          </v-btn>
          <v-btn
            color="primary"
            :loading="EditPasswordLoading"
            @click="submitEditTeacher"
          >
            اضافة
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit dialog -->

    <!--- Dailog for show info to user-->
    <v-dialog
      v-model="dialogData.open"
      max-width="500px"
    >
      <v-toolbar
        :color="dialogData.color"
        dense
      ></v-toolbar>
      <v-card>
        <v-card-title class="headline justify-center">
          {{
            dialogData.bodyText
          }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialogData.open = false"
          >
            تم
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      EditPasswordDialog: false,

      EditPasswordLoading: false,

      responseSelect: 1,

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      tableOptions: {},

      response: [
        {
          text: 'موافقة',
          value: 1,
        },
        {
          text: 'رفض',
          value: 2,
        },
      ],

      editedItem: {},

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
            width: 1,
            sortable: false,
            value: 'requist_vacation_id',
          },
          {
            text: 'اسم صاحب الطلب',
            sortable: false,
            value: 'account_name',
          },
          { text: 'نوعه', sortable: false, value: 'account_type' },
          {
            text: 'من تاريخ',
            sortable: false,
            value: 'requist_vacation_start_date',
          },
          {
            text: 'الى تاريخ',
            sortable: false,
            value: 'requist_vacation_end_date',
          },
          {
            text: 'عدد الايام',
            sortable: false,
            value: 'requist_vacation_number_days',
          },
          {
            text: 'السبب',
            sortable: false,
            value: 'requist_vacation_note',
          },
          {
            text: 'تاريخ الطلب',
            sortable: false,
            value: 'requist_vacation_created_at',
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

    // '$route.query.search': {
    //   handler(search) {
    //     this.table.search = search
    //     this.getTeacherDataAxios(search)
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },

  // async mounted() {
  //   this.getTeacherDataAxios()
  // },
  methods: {
    getTeacherDataAxios() {
      // let { search } = this.table
      this.table.loading = true
      let { page, itemsPerPage } = this.tableOptions

      // if (!search) {
      //   search = ''
      // }

      if (!page) {
        page = 1
      }
      if (!itemsPerPage) {
        itemsPerPage = 10
      }
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .get(`/requistVacation/${page}/${itemsPerPage}`)
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
            this.showDialogfunction(Response.data.results, '#FF8A80')
          }
        })
        .catch(error => {
          this.deleteItemLoading = false
          this.dialogDelete = false
          this.showDialogfunction('حصلت مشكلة يرجى المحاولة مجددا', '#FF8A80')
          console.log('error', error)
        })
    },

    EditPassword(item) {
      this.editedItem = { ...item }
      this.EditPasswordDialog = true
    },

    submitEditTeacher() {
      this.EditPasswordLoading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .put('requistVacation', {
          requist_vacation_id: this.editedItem.requist_vacation_id,
          requist_vacation_accepted: this.responseSelect,
        })
        .then(Response => {
          this.EditPasswordLoading = false
          if (Response.data.error == false) {
            this.EditPasswordDialog = false
            this.getTeacherDataAxios()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.showDialogfunction(Response.data.results, '#FF8A80')
          }
        })
        .catch(error => {
          this.EditPasswordLoading = false
          this.EditPasswordDialog = false
          this.showDialogfunction('حصلت مشكلة يرجى المحاولة مجددا', '#FF8A80')
          console.log('error', error)
        })
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
</style>
