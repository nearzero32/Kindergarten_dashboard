<template>
  <div>
    <v-container class="indigo lighten-5 my-5">
      <v-card class="white pa-3">
        <h1 class="text-center subtitle-4 black--text"> طلبات الانضمام </h1>
        <v-row class="mt-5">
          <v-col md="4" cols="12">
          </v-col>
          <v-spacer></v-spacer>
          <v-col md="4" cols="12">
            <!-- <div class="d-flex flex-row">
              <v-text-field
                v-model="table.search"
                label="البحث"
                outlined
                dense
                @keyup.enter="search()"
              ></v-text-field>
              <button
                class="search-btn"
                @click="search()"
              >
                <v-icon style="font-size: 18px; color: white">
                  fa-search
                </v-icon>
              </button>
            </div> -->
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-table :headers="table.headers" loading-text="جاري التحميل ... الرجاء الانتظار" :items="table.Data"
              :options.sync="tableOptions" :server-items-length="table.totalData" :loading="table.loading"
              class="elevation-1" :footer-props="{
                itemsPerPageOptions: [10, 50, 100],
              }">
              <template slot="item.id" slot-scope="props"> {{ ((tableOptions.page - 1) * tableOptions.itemsPerPage +
                  props.index) + 1
              }} </template>
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
    <v-dialog v-model="dialogDelete.open" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من حذف هذا الحساب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete.open = false"> الغاء </v-btn>
          <v-btn color="primary white--text" :loading="dialogDelete.loading" @click="deleteItemConfirm"> حذف </v-btn>
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
import adminApi from '@/api/adminApi'

export default {
  data() {
    return {
      deletedItem: {},

      tableOptions: {},

      dialogDelete: {
        open: false,
        loading: false,
      },

      dialogData: {
        open: false,
        color: 'primary',
        bodyText: 'test',
      },

      table: {
        search: null,
        totalData: 0,
        Data: [],
        loading: true,

        headers: [
          {
            text: '#',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          {
            text: 'اسم المدرسة',
            sortable: false,
            value: 'school_name',
          },
          { text: 'عدد الطلاب', sortable: false, value: 'student_number' },
          { text: 'الهاتف', sortable: false, value: 'mobile' },
          { text: 'المدينة', sortable: false, value: 'governorate' },
          {
            text: 'الموفع الجغرافي',
            sortable: false,
            value: 'location',
          },
          {
            text: 'اقرب نقطة دالة',
            sortable: false,
            value: 'nearest_point',
          },
          { text: 'الايميل', sortable: false, value: 'email' },
          { text: 'التاريخ', sortable: false, value: 'createdAt' },
          { text: 'العمليات', value: 'actions', sortable: false },
        ],
      },
    }
  },
  watch: {
    tableOptions: {
      handler() {
        this.getDataAxios()
      },
      deep: true,
    },

    // '$route.query.search': {
    //   handler(search) {
    //     this.table.search = search
    //     this.getTeacherDataAxios(search)
    //   },
    //   deep: true,

    //   // immediate: true,
    // },
  },

  // async mounted() {
  //   this.getTeacherDataAxios()
  // },
  methods: {
    async getDataAxios() {
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

      const response = await adminApi.getJoinUs(page, itemsPerPage)
      if (response.status === 401) {
        this.table.loading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.table.loading = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.table.loading = false
        this.table.Data = response.data.results
        this.table.totalData = response.data.count
      }


    },

    // search() {
    //   this.$router.replace(
    //     {
    //       query: { search: this.table.search },
    //     },
    //     () => {},
    //   )
    // },

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete.open = true
    },

    async deleteItemConfirm() {
      this.dialogDelete.loading = true

      const response = await adminApi.removeJoinUs(this.deletedItem._id)
      if (response.status === 401) {
        this.dialogDelete.loading = false
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.dialogDelete.open = false
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.dialogDelete.loading = false
        this.dialogDelete.open = false
        this.getDataAxios()
        this.showDialogfunction(response.data.results, 'primary')
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

table.v-table tbody td {
  color: black;
}
</style>
