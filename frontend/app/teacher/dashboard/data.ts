// app/teacher/dashboard/data.ts

export const TEACHER_SUBJECTS = [
  {
    id: 1,
    code: 'CS332',
    name: 'Basic Cloud Computing',
    displayShort: 'CS332 · Basic Cloud Computing',
    subtitle: 'Cloud foundations for student success',
    weeks: '4 weeks',
    stats: {
      avgReadiness: '88%',
      semesterProgress: '72%',
      progressCriteria: 'Based on active sessions',
      sessionsRun: 12,
      studentsCaughtUp: '90%',
    },
  },
];

export const TEACHER_SESSIONS = {
  CS332: [
    {
      id: 1,
      week: 'Week 1',
      title: 'Cloud fundamentals',
      status: 'Completed',
      segments: ['bg-emerald-400', 'bg-emerald-300', 'bg-emerald-200', 'bg-stone-100'],
      avgReadiness: '94%',
      isLive: false,
    },
    {
      id: 2,
      week: 'Week 2',
      title: 'S3 and storage tiers',
      status: 'Completed',
      segments: ['bg-orange-400', 'bg-orange-300', 'bg-orange-200', 'bg-stone-100'],
      avgReadiness: '82%',
      isLive: false,
    },
    {
      id: 3,
      week: 'Week 3',
      title: 'EC2 and IAM',
      status: 'Active',
      segments: ['bg-orange-500', 'bg-orange-300', 'bg-orange-200', 'bg-stone-100'],
      avgReadiness: '88%',
      isLive: true,
    },
    {
      id: 4,
      week: 'Week 4',
      title: 'VPC networking',
      status: 'Upcoming',
      segments: ['bg-slate-400', 'bg-slate-300', 'bg-slate-200', 'bg-stone-100'],
      avgReadiness: '–',
      isLive: false,
    },
  ]
};
