const isProd = true; // will be replaced during build

export function disableConsoleInProd() {
  if (isProd) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    // keep error for production debugging
  }
}