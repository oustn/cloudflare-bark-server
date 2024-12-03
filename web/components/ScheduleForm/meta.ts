export const ScheduleTypes = [
  // {
  //   label: '自定义频率',
  //   desc: '按照自定义的时间间隔（天、周、月）触发',
  //   value: 'custom'
  // },
  {
    label: '每天',
    desc: '每天在选定的时间触发',
    value: 'daily',
  },
  {
    label: '每时',
    desc: '每小时固定时间触发',
    value: 'hourly',
  },
  {
    label: '每月',
    desc: '每月在选定的日期触发',
    value: 'monthly',
  },
  {
    label: '每周',
    desc: '每周在选定的日期触发',
    value: 'weekly',
  },
]

export const DailyRange = new Array(24).fill(0).map((_, i) => ({
  label: `${i % 12 === 0 ? 12 : i % 12}:00 ${i < 12 ? 'AM' : 'PM'}`,
  value: String(i).padStart(2, '0'),
  desc: `在每天的 ${i % 12 === 0 ? 12 : i % 12}:00 ${i < 12 ? 'AM' : 'PM'} 触发`,
}))

export const DailyAt = ['00', '15', '30', '45'].map(time => ({
  label: time,
  value: time,
  desc: `在每时的 ${time} 分钟触发`,
}))

export const MonthlyRange = new Array(31).fill(0).map((_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
  desc: `在每月的 ${i + 1} 号触发`,
}))

export const HourlyRange = new Array(24).fill(0).map((_, i) => ['00', '15', '30', '45'].map(time => ({
  label: `${i % 12 === 0 ? 12 : i % 12}:${time} ${i < 12 ? 'AM' : 'PM'}`,
  value: String(i).padStart(2, '0') + time,
  desc: `在每天的 ${i % 12 === 0 ? 12 : i % 12}:${time} ${i < 12 ? 'AM' : 'PM'} 触发`,
}))).flat()

export const WeeklyRange = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, i) => ({
  label: day,
  value: String(i),
  desc: `在每周的${day}触发`,
}))

export const ScheduleTypeMap = {
  daily: {
    in: DailyRange,
    at: DailyAt,
  },
  hourly: {
    in: HourlyRange,
    at: [],
  },
  monthly: {
    in: MonthlyRange,
    at: HourlyRange,
  },
  weekly: {
    in: WeeklyRange,
    at: HourlyRange,
  },
}