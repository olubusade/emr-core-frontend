export const environment = {
  production: true,

  apiUrl: 'https://api.example.com/api',
  fhirBaseUrl: 'https://api.example.com/api/fhir',

  avatarImage: "assets/images/default-avatar.png",
  appName: 'Busade EMR Platform',
  version: '1.0.0',
  DISABLE_LOG:true,
  features: {
    btgEnabled: true,
    auditTrailEnabled: true,
    fhirEnabled: true,
  }
};