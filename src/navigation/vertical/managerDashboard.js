/* eslint-disable */
export default [{
  title: 'الصفحة الرئيسية',
  icon: 'fa-home',
  to: 'home',
},
{
  title: 'الاساتذة',
  icon: 'fa-chalkboard-teacher',
  to: 'teachers',
},
{
  title: 'الطلاب',
  icon: 'fa-user-graduate',
  children: [{
    title: 'الطلاب المسجلين',
    to: { name: 'selectClassSchool' },
  },
  {
    title: 'طلبات التسجيل',
    to: { name: 'newStudent' },
  },
  {
    title: 'الطلاب الموقوفين',
    to: { name: 'stopedStudent' },
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

//Reviews
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

{
  title: 'السواق',
  icon: 'fa-bus',
  to: 'drivers',
},
{
  title: 'الجدول الدراسي',
  icon: 'fa-calendar-alt',
  to: 'selectClassForSchedule',
},

{
  title: 'الصف والشعبة',
  icon: 'fa-school',
  to: 'classSchool',
},
{
  title: 'الامتحانات',
  icon: 'fa-question-circle',
  to: 'selectClassSchoolExam',
},
{
  title: 'الاشعارات',
  icon: 'fa-bell',
  to: 'notification',
},
{
  title: 'حول المدرسة',
  icon: 'fa-calendar-alt',
  children: [{
    title: 'طلب اجازة',
    to: { name: 'requistVacation' },
  },
  {
    title: 'طلب وثيقة',
    to: { name: 'certificate' },
  },
  {
    title: 'طلب تعيين',
    to: { name: 'hireReq' },
  },
  {
    title: 'اخر الاخبار',
    to: { name: 'latestNews' },
  },
  {
    title: 'اتصل بنا',
    to: { name: 'connectUs' },
  },
  ],
},
]
