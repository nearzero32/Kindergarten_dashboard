/* eslint-disable */

export let index = [{
    title: 'الصفحة الرئيسية',
    icon: 'fa-home',
    to: 'home',
  },

  //teachers
  // {
  //   title: 'الاساتذة',
  //   icon: 'fa-chalkboard-teacher',
  //   to: 'teachers',
  // },

  //students
  {
    title: 'الطلاب',
    icon: 'fa-user-graduate',
    children: [{
        title: 'الطلاب المسجلين',
        to: 'students',
        // alias: ['/studentInClass', '/addStudent', '/studentProfile'],
      },
      {
        title: 'جميع الطلاب',
        to: { name: 'allStudent' },
      },
      {
        title: 'الطلاب الموقوفين',
        to: { name: 'stopedStudent' },
      },
      {
        title: 'الطلاب المحذوفين',
        to: { name: 'deletedStudent' },
      },
    ],
  },

  //absence
  {
    title: 'الحضور',
    icon: ' fa-clock',
    children: [{
        title: 'عرض',
        to: 'absenceShow',
      },
      {
        title: 'اضافة',
        to: 'absenceAdd',
      },
    ],
  },

  //absenceTeacher
  {
    title: 'حضور الاساتذة',
    icon: ' fa-clock',
    children: [{
        title: 'عرض',
        to: 'absenceShowTeacher',
      },
      {
        title: 'اضافة',
        to: 'absenceAddTeacher',
      },
    ],
  },

  //Review
  {
    title: 'التقييم',
    icon: 'fa fa-comments',
    children: [{
        title: 'عرض',
        to: 'showReview',
      },
      {
        title: 'اضافة',
        to: 'reviewAdd',
      },
    ],
  },

  //DailyExams
  {
    title: 'الامتحانات اليومية',
    icon: 'fa fa-book-open',
    children: [{
        title: 'عرض',
        to: 'showDailyExam',
      },
      {
        title: 'اضافة',
        to: 'dailyExamAdd',
      },
    ],
  },

  // drivers
  {
    title: 'السواق',
    icon: 'fa-bus',
    to: 'drivers',
  },

  //stream
  {
    title: 'البث المباشر',
    icon: 'fa-broadcast-tower',
    to: 'stream',
  },

  //schedule
  {
    title: 'الجدول الدراسي',
    icon: 'fa-calendar-alt',
    to: 'schedule',
  },
  //classSchool
  {
    title: 'الصف والشعبة',
    icon: 'fa-school',
    to: 'classSchool',
  },

  //exams
  {
    title: 'الامتحانات والدرجات',
    icon: 'fa-question-circle',
    children: [{
        title: 'عرض',
        to: 'examsShow',
      },
      {
        title: 'اضافة',
        to: 'examsAdd',
      },
    ],
  },

  //notification
  {
    title: 'الاشعارات',
    icon: 'fa-bell',
    to: 'notification',
  },

  //hireReq
  {
    title: 'طلب تعيين',
    icon: 'fa-file-contract',
    to: 'hireReq',
  },

  //latestNews
  {
    title: 'اخر الاخبار',
    icon: 'fa-newspaper',
    to: 'latestNews',
  },

  //connectUs
  {
    title: 'اتصل بنا',
    icon: 'fa-phone-square',
    to: 'connectUs',
  },
]

// export default index
