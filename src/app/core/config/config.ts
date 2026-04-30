export const appConfig = {
  // =========================
  // PAGINATION
  // =========================
  pagination: {
    defaultPageSize: 12,
    pageSizes: [12, 24, 36, 48, 60],
    tablePageSizes: [10, 20, 30, 40, 50, 100],
  },

  // =========================
  // ROUTES
  // =========================
  authRoutes: ['/'],

  // =========================
  // DATE / FORMAT
  // =========================
  dateFormat: 'DD-MM-YYYY',
  yearRange: 100,

  // =========================
  // EXTERNAL RESOURCES
  // =========================
  googleDocViewer: `${window.location.protocol}//docs.google.com/viewer?url=`,

  // =========================
  // STATUS CODES (HTTP STANDARD ONLY)
  // =========================
  httpStatus: {
    ok: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    internalServerError: 500,
    serviceUnavailable: 503,
  },

  // =========================
  // VALIDATION PATTERNS
  // =========================
  patterns: {
    username: /^[a-zA-Z0-9_]{3,15}$/,
    name: /^[a-zA-Z .\-']*$/,
    city: /^[a-zA-Z .\-']*$/,
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    phone: /\(?\d{3}\)?-?\s?\d{3}-?\s?-?\d{4}/,
    postalCode: /(^\d{5}(-\d{4})?$)/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/,
  },

  // =========================
  // EMAIL CONFIG (UI ONLY)
  // =========================
  email: {
    noReply: 'no-reply@admin.busade-emr-demo.com',
    copyright: `© ${new Date().getFullYear()} Busade EMR Demo`,
    logoUrl: '/assets/images/logo.png',
  },

  // =========================
  // FILE UPLOAD
  // =========================
  files: {
    maxImageSize: 20 * 1024 * 1024, // 20MB
  },

  // =========================
  // LOCAL STORAGE KEYS
  // =========================
  storage: {
    auditLogin: '_busade_audit_login',
    currentUser: '_busade_cu_',
    refreshToken: '_busade_rt_',
  },

  // =========================
  // PERFORMANCE
  // =========================
  loaderTimeout: 10000,
};