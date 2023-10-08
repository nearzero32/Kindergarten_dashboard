<template>
  <div class="team">
    <v-card class="white pa-3">
      <h1 class="text-center subtitle-4 black--text mb-5"> الاعلانات</h1>
      <v-row>
        <v-col md="3" sm="3" xs="12" align-self="center">
          <v-btn tile color="primary" @click="goToAddPage"> اضافة اعلان <v-icon right style="font-size: 15px"> fa-plus
            </v-icon>
          </v-btn>
        </v-col>
        <!-- <v-spacer></v-spacer> -->
        <!-- <v-col
          md="3"
          sm="3"
          xs="12"
        >
          <v-text-field
            v-model="table.search"
            label="البحث"
            append-icon="mdi-magnify"
            single-line
            hide-details
          ></v-text-field>
        </v-col> -->
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table :headers="table.headers" loading-text="جاري التحميل ... الرجاء الانتظار"
            :items="table.teacherData" :options.sync="tableOptions" :server-items-length="table.totalTeacherData"
            :loading="table.loading" class="elevation-1" :footer-props="{
              itemsPerPageOptions: [10, 50, 100],
            }">
            <template slot="item._id" slot-scope="props"> {{ (tableOptions.page - 1) * tableOptions.itemsPerPage +
                props.index + 1
            }} </template>
            <template v-slot:item.img="{ item }">
              <img v-if="item.img" class="teacher_image_table" :src="content_url + item.img" alt width="50" height="50"
                @click="showImage(item.img)" />
            </template>
            <template v-slot:item.link="{ item }">
              <v-btn v-if="item.link" color="primary" @click="goToLink(item.link)"> الدخول الى الرابط </v-btn>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="#FF8A80" v-bind="attrs" size="20" v-on="on" @click="deleteItem(item)"> fa-trash
                  </v-icon>
                </template>
                <span>حذف</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
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
                <img :src="content_url + table.imageUrlForShow" alt width="300" height="200" />
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="ml-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="table.showImageDailog = false"> الغاء </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- image Teacher dialog -->
    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete.open" max-width="500px">
      <v-card>
        <v-card-title class="headline justify-center"> هل انت متأكد من حذف هذا الطلب ؟ </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogDelete.open = false"> الغاء </v-btn>
          <v-btn color="primary" :loading="dialogDelete.loading" @click="deleteItemConfirm"> حذف </v-btn>
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
import api from '@/api/api'
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

      content_url: null,

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
            value: '_id',
          },
          {
            text: 'العنوان',
            sortable: false,
            value: 'title',
          },
          { text: 'الوصف', sortable: false, value: 'desc' },
          {
            text: 'الرابط',
            sortable: false,
            value: 'link',
          },
          {
            text: 'الهاتف',
            sortable: false,
            value: 'phone',
          },
          {
            text: 'الصورة',
            sortable: false,
            value: 'img',
          },
          {
            text: 'التاريخ',
            sortable: false,
            value: 'createdAt',
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
    async getTeacherDataAxios() {
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


      const response = await api.getAds(page, itemsPerPage, null)
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

    deleteItem(item) {
      this.deletedItem = { ...item }
      this.dialogDelete.open = true
    },

    async deleteItemConfirm() {
      this.dialogDelete.loading = true

      const response = await api.removeAds(this.deletedItem._id)

      if (response.status === 401) {
        this.$store.dispatch('submitLogout')
      } else if (response.status === 500) {
        this.dialogDelete.loading = false
        this.dialogDelete.open
        this.showDialogfunction(response.data.results, '#FF5252')
      } else {
        this.dialogDelete.loading = false
        this.dialogDelete.open = false
        this.getTeacherDataAxios()
        this.showDialogfunction(response.data.results, 'primary')
      }
    },

    showDialogfunction(bodyText, color) {
      this.dialogData.open = true
      this.dialogData.bodyText = bodyText
      this.dialogData.color = color
    },

    goToAddPage() {
      this.$router.push('/ads/addAds')
    },

    showImage(image) {
      this.table.showImageDailog = true
      this.table.imageUrlForShow = image
    },

    goToLink(file) {
      window.open(file)
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
