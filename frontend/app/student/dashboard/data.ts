// app/student/dashboard/data.ts

export const SUBJECTS = [
  {
    id: 1,
    code: 'CS332',
    name: 'Basic Cloud Computing',
    displayShort: 'CS332 · Basic Cloud Computing',
    weeks: '4 weeks',
  }
];

export const SESSIONS_BY_SUBJECT = {
  CS332: [
    {
      id: 1,
      week: 'Week 1',
      title: 'Cloud fundamentals',
      description: 'Core concepts of cloud computing',
      status: 'Completed',
      date: 'Mar 1',
      info: 'Readiness 94%',
    },
    {
      id: 2,
      week: 'Week 2',
      title: 'S3 and storage tiers',
      description: 'Object storage fundamentals and lifecycle policies',
      status: 'Completed',
      date: 'Mar 8',
      info: 'Readiness 82%',
    },
    {
      id: 3,
      week: 'Week 3',
      title: 'EC2 and IAM',
      description: 'Understanding EC2 instances and IAM roles for secure access',
      status: 'Active',
      date: 'Mar 15',
      info: 'Before class',
    },
    {
      id: 4,
      week: 'Week 4',
      title: 'VPC networking',
      description: 'Subnets, route tables, and security groups',
      status: 'Upcoming',
      date: 'Mar 22',
      info: 'Not started',
    },
  ]
};