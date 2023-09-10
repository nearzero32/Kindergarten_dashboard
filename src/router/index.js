import Vue from 'vue'
import VueRouter from 'vue-router'
/* eslint-disable */
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   redirect: 'login',
  // },
  //home
  {
    path: '/home',
    name: 'home',
    component: () =>
      import('@/views/Home.vue'),
    // beforeEnter(to, from, next) {
    //   if (localStorage.getItem('accessToken') && account_type === 'manager') {
    //     next()
    //   } else {
    //     next('/login')
    //   }
    // },

    meta: {
      layout: 'content',
    },
  },
  //teachers
  {
    path: '/teachers',
    name: 'teachers',
    component: () =>
      import('@/views/manager/teachers/teachers.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/teachers/addTeacher',
    name: 'addTeacher',

    component: () =>
      import('@/views/manager/teachers/addTeacher.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/teachers/:id/:name',
    name: 'TeacherProfile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import('@/views/manager/teachers/TeacherProfile'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/teachers/monthlyPaymentDetails/:id/:name/:startDate/:endDate',
    name: 'monthlyPaymentDetails',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "MonthlyPaymentDetails" */
        '@/views/manager/teachers/teacherProfileInfo/monthlyPayment/monthlyPaymentDetails.vue'
      ),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  // End teachers

  // students
  //stopedStudent
  {
    path: '/stopedStudent',
    name: 'stopedStudent',
    component: () =>
      import('@/views/manager/stopedStudent/stopedStudent.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //newStudent
  {
    path: '/newStudent',
    name: 'newStudent',
    component: () =>
      import('@/views/manager/newStudent/newStudent.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  // print student
  {
    path: '/printStudents',
    name: 'printStudents',
    component: () =>
      import('@/views/manager/students/print/invoice.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' || JSON.parse(localStorage.getItem('results')).account_type === 'assistance')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'blank',
    },
  },

  //student bills
  {
    path: '/studentBills/studentId/:studentId/studentName/:studentName',
    name: 'studentBills',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "selectClassSchool" */ '@/views/manager/students/student_account/student_bills.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  //student bills
  {
    path: '/studentBills/showBills/student_id/:student_id/student_name/:student_name/showDetails/id/:id/name/:name',
    name: 'studentPayments',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "selectClassSchool" */ '@/views/manager/students/student_account/student_payment.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  // one student print
  {
    path: '/printOneStudents',
    name: 'printOneStudents',
    component: () =>
      import('@/views/manager/students/print/invoiceOneStudent.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' ||
          JSON.parse(localStorage.getItem('results')).account_type === 'accountantPrivilege')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'blank',
    },
  },

  // studentBillDetailsInvoice
  {
    path: '/studentBillDetailsInvoice',
    name: 'studentBillDetailsInvoice',
    component: () =>
      import('@/views/manager/students/student_account/invoice.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' ||
          JSON.parse(localStorage.getItem('results')).account_type === 'accountantPrivilege')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'blank',
    },
  },

  //deletedStudent
  {
    path: '/deletedStudent',
    name: 'deletedStudent',
    component: () =>
      import('@/views/manager/deletedStudent/deletedStudent.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  // review Show
  {
    path: '/showReview',
    name: 'showReview',
    component: () =>
      import('@/views/manager/review/reviewShow/selectClassAndDate.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' || JSON.parse(localStorage.getItem('results')).account_type === 'assistance')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/showReview/show/details/:account_id/:account_name',
    name: 'showingReviewDetailsTeacher',
    component: () =>
      import('@/views/manager/review/reviewShow/review_details.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' || JSON.parse(localStorage.getItem('results')).account_type === 'assistance')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/showReview/show/:class_id/:date/:class_name',
    name: 'showingReviewClassSchool',
    component: () =>
      import('@/views/manager/review/reviewShow/review.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' || JSON.parse(localStorage.getItem('results')).account_type === 'assistance')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  // review Show

  // review Add
  {
    path: '/review/add',
    name: 'reviewAdd',

    component: () =>
      import('@/views/manager/review/reviewAdd/selectClassAndDate.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' || JSON.parse(localStorage.getItem('results')).account_type === 'assistance')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/review/add/:class_school_id/:date/:class_school_name',
    name: 'reviewAddShow',
    component: () =>
      import('@/views/manager/review/reviewAdd/review.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' || JSON.parse(localStorage.getItem('results')).account_type === 'assistance')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  // review Add

  //AllStudent
  {
    path: '/allStudent',
    name: 'allStudent',
    component: () =>
      import('@/views/manager/students/allStudents.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  // students

  // Absence Show
  {
    path: '/showAbsence',
    name: 'absenceShow',
    component: () =>
      import('@/views/manager/absence/absenceShow/absenceSelectClass.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/showAbsence/show/:class_school_id/:class_school_name',
    name: 'showingAbsence',
    component: () =>
      import('@/views/manager/absence/absenceShow/absence.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/showAbsence/show/details/:account_id/:account_name',
    name: 'showingAbsenceDetails',
    component: () =>
      import('@/views/manager/absence/absenceShow/absenceDetails.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  // Absence Show

  // absence Add
  {
    path: '/absence/add',
    name: 'absenceAdd',

    component: () =>
      import('@/views/manager/absence/absenceAdd/selectClassAndDate.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/absence/add/:class_school_id/:date/:class_school_name',
    name: 'absenceAddShow',
    component: () =>
      import('@/views/manager/absence/absenceAdd/absence.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/absence/addNew/:class_school_id/:date/:class_school_name',
    name: 'absenceAddShowTest',
    component: () =>
      import('@/views/manager/absence/absenceAdd/absenceNew.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  // absence Add

  // Absence Show Teacher
  {
    path: '/showAbsenceTeacher',
    name: 'absenceShowTeacher',
    component: () =>
      import('@/views/manager/absenceTeacher/absenceShow/absence.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  {
    path: '/showAbsenceTeacher/show/details/:account_id/:account_name',
    name: 'showingAbsenceDetailsTeacher',
    component: () =>
      import('@/views/manager/absenceTeacher/absenceShow/absenceDetails.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  // Absence Show Teacher

  // absence Add Teacher
  {
    path: '/absenceTeacher/add',
    name: 'absenceAddTeacher',

    component: () =>
      import('@/views/manager/absenceTeacher/absenceAdd/selectClassAndDate.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/absenceTeacher/add/:date',
    name: 'absenceAddShowTeacher',
    component: () =>
      import('@/views/manager/absenceTeacher/absenceAdd/absence.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  // absence Add Teacher


  // subject
  {
    path: '/subject',
    name: 'subject',
    component: () =>
      import('@/views/manager/subject/subject.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //classSchool
  {
    path: '/classSchool',
    name: 'classSchool',
    component: () =>
      import('@/views/manager/classSchool/classSchool.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  {
    path: '/classSchoolInvoice/id/:id',
    name: 'classSchoolInvoice',
    component: () =>
      import('@/views/manager/classSchool/classSchoolInvoice.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //classSchool

  //notification
  {
    path: '/notification',
    name: 'notification',
    component: () =>
      import('@/views/manager/notification/notification.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/notification/addNotification',
    name: 'addNotification',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "addNotification" */ '@/views/manager/notification/addNotification.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/notificationForStudent/:class_school/:student_id/:student_name',
    name: 'notificationForStudent',
    component: () =>
      import('@/views/manager/notification/notificationForStudent.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/notificationForTeacher/:teacher_id/:teacher_name',
    name: 'notificationForTeachert',
    component: () =>
      import('@/views/manager/notification/notificationForTeacher.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //messages

  {
    path: '/messages',
    name: 'messages',
    component: () =>
      import('@/views/manager/message/messages.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/messages/addMessages',
    name: 'addMessages',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "addNotification" */ '@/views/manager/message/addMessages.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //drivers
  {
    path: '/drivers',
    name: 'drivers',
    component: () =>
      import('@/views/manager/driver/driver.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' || JSON.parse(localStorage.getItem('results')).account_type === 'assistance')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/drivers/addDriver',
    name: 'addDriver',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "drivers" */ '@/views/manager/driver/addDriver.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' || JSON.parse(localStorage.getItem('results')).account_type === 'assistance')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/drivers/:id/:name',
    name: 'driversProfile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "drivers" */ '@/views/manager/driver/driverProfile.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        (JSON.parse(localStorage.getItem('results')).account_type === 'manager' || JSON.parse(localStorage.getItem('results')).account_type === 'assistance')
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },


  // fingerPrint
  {
    path: '/fingerPrint',
    name: 'fingerPrint',
    component: () =>
      import('@/views/manager/fingerPrint/fingerPrint.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  // schoolRq
  {
    path: '/schoolReq',
    name: 'schoolReq',
    component: () =>
      import('@/views/manager/schoolReq/schoolReq.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  // kindergartenReq
  {
    path: '/kindergartenReq',
    name: 'kindergartenReq',
    component: () =>
      import('@/views/manager/kindergartenReq/request.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  {
    path: '/kindergartenReqDetails',
    name: 'kindergartenReqDetails',
    component: () =>
      import('@/views/manager/kindergartenReq/moreDetails.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  // schoolWorkReq
  {
    path: '/schoolWorkReq',
    name: 'schoolWorkReq',
    component: () =>
      import('@/views/manager/schoolReq/schoolWorkReq.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  {
    path: '/schoolReqDetails',
    name: 'schoolReqDetails',
    component: () =>
      import('@/views/manager/schoolReq/moreDetails.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  {
    path: '/schoolWorkReqMoreDetails',
    name: 'schoolWorkReqMoreDetails',
    component: () =>
      import('@/views/manager/schoolReq/schoolWorkReqMoreDetails.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //studyStrategy

  {
    path: '/studyStrategy',
    name: 'studyStrategy',
    component: () =>
      import('@/views/manager/studyStrategy/studyStrategy.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/studyStrategy/addStudyStrategy',
    name: 'addStudyStrategy',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "addStudyStrategy" */ '@/views/manager/studyStrategy/addStudyStrategy.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //montessori

  {
    path: '/montessori',
    name: 'montessori',
    component: () =>
      import('@/views/manager/montessori/montessori.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/montessori/addMontessori',
    name: 'addMontessori',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "addNotification" */ '@/views/manager/montessori/addMontessori.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //occasions

  {
    path: '/occasions',
    name: 'occasions',
    component: () =>
      import('@/views/manager/occasions/occasions.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/occasions/addOccasions',
    name: 'addOccasions',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "addNotification" */ '@/views/manager/occasions/addOccasions.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },


  //activities

  {
    path: '/activities',
    name: 'activities',
    component: () =>
      import('@/views/manager/activities/activities.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/activities/addActivities',
    name: 'addActivities',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "addNotification" */ '@/views/manager/activities/addActivities.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },


  //students
  {
    path: '/students',
    name: 'students',

    component: () =>
      import('@/views/manager/students/selectClass.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  {
    path: '/students/studentInClass/:class_school_id/:class_school_leader/:classes_name',
    name: 'studentInClass',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "students" */ '@/views/manager/students/students.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  //addStudent
  {
    path: '/students/addStudent/:class_school_id',
    name: 'addStudent',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "selectClassSchool" */ '@/views/manager/students/addStudent.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  //studentProfile
  {
    path: '/students/studentProfile/:id/:name',
    name: 'studentProfile',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "selectClassSchool" */ '@/views/manager/students/studentProfile.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  //students

  {
    path: '/stream',
    name: 'stream',
    component: () =>
      import('@/views/manager/steaming/stream'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //requistVacation
  {
    path: '/requistVacation',
    name: 'requistVacation',
    component: () =>
      import('@/views/manager/aboutSchool/requistVacation.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  //requistVacation

  //certificate
  {
    path: '/certificate',
    name: 'certificate',
    component: () =>
      import('@/views/manager/aboutSchool/certificate.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },
  //certificate

  //counting
  {
    path: '/counting',
    name: 'counting',
    component: () =>
      import('@/views/manager/counting.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //connectUs
  {
    path: '/connectUs',
    name: 'connectUs',
    component: () =>
      import('@/views/manager/aboutSchool/connectUs.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //ads
  {
    path: '/ads',
    name: 'ads',
    component: () =>
      import('@/views/manager/ads/ads.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  {
    path: '/ads/addAds',
    name: 'addAds',
    component: () =>
      import('@/views/manager/ads/addAds.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //paymentRequired
  {
    path: '/paymentRequired',
    name: 'paymentRequired',
    component: () =>
      import('@/views/manager/paymentRequired/paymentRequired.vue'),
    beforeEnter(to, from, next) {
      if (
        localStorage.getItem('accessToken') &&
        JSON.parse(localStorage.getItem('results')).account_type === 'manager'
      ) {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //Admin

  //adminAddSchool
  {
    path: '/adminAddSchool',
    name: 'adminAddSchool',
    component: () =>
      import('@/views/admin/schools/adminAddSchool.vue'),
    beforeEnter(to, from, next) {
      if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },


  //edit School
  {
    path: '/editSchool/school_name/:school_name/school_id/:school_id',
    name: 'editSchool',
    component: () =>
      import('@/views/admin/schools/editSchool.vue'),
    beforeEnter(to, from, next) {
      if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //adminHome
  {
    path: '/adminHome',
    name: 'adminHome',
    component: () =>
      import('@/views/admin/adminHome.vue'),
    // beforeEnter(to, from, next) {
    //   if (localStorage.getItem('accessToken') && account_type === 'admin') {
    //     next()
    //   } else {
    //     next('/login')
    //   }
    // },
    meta: {
      layout: 'content',
    },
  },

  // adminSubject
  {
    path: '/adminSubject',
    name: 'adminSubject',
    component: () =>
      import('@/views/admin/subject/subject.vue'),
    beforeEnter(to, from, next) {
      if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //addSchool
  {
    path: '/addSchool',
    name: 'addSchool',
    component: () =>
      import('@/views/admin/schools/addSchool.vue'),
    beforeEnter(to, from, next) {
      if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //schoolProfile
  {
    path: '/schoolProfile/:name/:id',
    name: 'schoolProfile',
    component: () =>
      import('@/views/admin/schoolProfile.vue'),
    beforeEnter(to, from, next) {
      if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //AddSchoolAccount
  {
    path: '/AddSchoolAccount/:id',
    name: 'AddSchoolAccount',
    component: () =>
      import('@/views/admin/addSchoolAccount.vue'),
    beforeEnter(to, from, next) {
      if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //AddSchoolAccount
  {
    path: '/adminJoinUs',
    name: 'adminJoinUs',
    component: () =>
      import('@/views/admin/joinUs/joinUs.vue'),
    beforeEnter(to, from, next) {
      if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //adminContactUs
  {
    path: '/adminContactUs',
    name: 'adminContactUs',
    component: () =>
      import('@/views/admin/contactUs/contactUs.vue'),
    beforeEnter(to, from, next) {
      if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
        next()
      } else {
        next('/')
      }
    },
    meta: {
      layout: 'content',
    },
  },

  //accountHome
  {
    path: '/accountHome',
    name: 'accountHome',
    component: () =>
      import('@/views/account/accountHome/accountHome.vue'),
    // beforeEnter(to, from, next) {
    //     if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
    //         next()
    //     } else {
    //         next('/')
    //     }
    // },
    meta: {
      layout: 'content',
    },
  },

  //setting
  {
    path: '/setting',
    name: 'setting',
    component: () =>
      import('@/views/setting/setting.vue'),
    // beforeEnter(to, from, next) {
    //     if (localStorage.getItem('accessToken') && JSON.parse(localStorage.getItem('results')).account_type === 'admin') {
    //         next()
    //     } else {
    //         next('/')
    //     }
    // },
    meta: {
      layout: 'content',
    },
  },
  //login
  {
    path: '/',
    name: 'login',
    component: () =>
      import('@/views/Login.vue'),

    meta: {
      layout: 'blank',
      reload: true,
    },
  },
  // {
  //   path: '*',
  //   redirect: 'error-404',
  //   component: () =>
  //     import ('@/views/Error404.vue'),
  // },
]

const router = new VueRouter({
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
})

export default router
