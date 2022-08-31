<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text mb-5">
        طلب وثيقة
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
              slot="item.certificate_id"
              slot-scope="props"
            >
              {{
                (tableOptions.page - 1) * tableOptions.itemsPerPage +
                  props.index +
                  1
              }}
            </template>
            <!-- <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="item.requist_vacation_accepted == 0"
                color="warning"
                class="ml-2"
                @click="EditPassword(item)"
              >
                الانتظار
              </v-btn>
            </template> -->
            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="#FF8A80"
                    v-bind="attrs"
                    size="20"
                    v-on="on"
                    @click="deleteItem(item)"
                  >
                    fa-trash
                  </v-icon>
                </template>
                <span>حذف</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>

    <!-- delete dialog -->
    <v-dialog
      v-model="dialogDelete.open"
      max-width="500px"
    >
      <v-card>
        <v-card-title
          class="headline justify-center"
        >
          هل انت متأكد من حذف هذا الطلب ؟
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialogDelete.open = false"
          >
            الغاء
          </v-btn>
          <v-btn
            color="primary"
            :loading="dialogDelete.loading"
            @click="deleteItemConfirm"
          >
            حذف
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End delete dailog -->

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
      dialogDelete: {
        open: false,
        loading: false,
      },

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
            value: 'certificate_id',
          },
          {
            text: 'اسم صاحب الطلب',
            sortable: false,
            value: 'full_name',
          },
          { text: 'المواليد', sortable: false, value: 'birthday' },
          {
            text: 'تاريخ التخرج',
            sortable: false,
            value: 'graduated_year',
          },
          {
            text: 'هدف التعيين',
            sortable: false,
            value: 'certificate_purpose',
          },
          {
            text: 'تاريخ الطلب',
            sortable: false,
            value: 'created_at',
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
        .get(`/certificate/${page}/${itemsPerPage}`)
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
      this.dialogDelete.open = true
    },

    deleteItemConfirm() {
      this.dialogDelete.loading = true
      this.axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
      this.axios
        .delete(`certificate/${this.deletedItem.certificate_id}`)
        .then(Response => {
          if (Response.data.error === false) {
            this.dialogDelete.loading = false
            this.dialogDelete = false
            this.getTeacherDataAxios()
            this.showDialogfunction(Response.data.results, 'primary')
          } else {
            this.showDialogfunction(Response.data.results, '#FF8A80')
          }
        })
        .catch(error => {
          this.dialogDelete.loading = false
          this.dialogDelete = false
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
