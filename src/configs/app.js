require("dotenv").config();

module.exports = {
  secret: process.env.SECRET || "TT5P25fms",
  expiresIn: process.env.EXPIRED || "60m",
  expiresInRefresh: process.env.EXPIRED_REFRESH || "120m",
  ma_dv: process.env.UNIT_CODE || "BQPQDNDVNDCS",
  name_software: process.env.NAME_SOFTWARE || "",
  url_send: process.env.URL_SEND || "",
  url_share_service: process.env.URL_SHARE_SERVICE || "",
  type_software: process.env.TYPE_SOFTWARE || "",
  region1: process.env.REGION1 || 0,
  region2: process.env.REGION2 || 0,
  region3: process.env.REGION3 || 0,
  url_region1: process.env.URL_REGION1 || "",
  url_region2: process.env.URL_REGION2 || "",
  url_region3: process.env.URL_REGION3 || "",
  check_day_online: process.env.CHECK_DAY_ONLINE || "",
  check_miav_connect: process.env.CHECK_MIAV_CONNECT || "",
  active_device_send: process.env.ACTIVE_DEVICE_SEND,
  ident_device_send: process.env.IDENT_DEVICE_SEND,
  alerts_send: process.env.ALERTS_SENT,
  events_send: process.env.EVENTS_SEND,
  time_send_schedule: process.env.TIME_SEND_SCHEDULE,
  time_receive_schedule: process.env.TIME_RECEIVE_SCHEDULE,
  role: {
    superAdmin: "superAdmin",
    admin: "admin",
    user: "user",
  },
  level_alert: { hight: 3, average: 2, low: 1 },
  alert_type: {
    usb: "Usb",
    policy: "Policy",
    malware: "Malware",
    process: "Process",
    autorun: "Autorun",
    persistence: "Persistence",
    blackdomain: "BlackDomain",
  },
  default_password: "Btl86@123",
  firstId: 1,
};
