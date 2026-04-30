// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  fhirBaseUrl: 'http://localhost:5000/api/fhir',
  
  avatarImage: "assets/images/avatar.png",
  appName: 'Busade EMR Platform',
  version: '1.0.0',
  DISABLE_LOG:false,
  features: {
    btgEnabled: true,
    auditTrailEnabled: true,
    fhirEnabled: true,
  }
};
