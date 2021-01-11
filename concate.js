const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
    const files_es5 = [
        './mootoolscompat.js',
        './dist/alpdeskfee-client/runtime-es5.js',
        './dist/alpdeskfee-client/polyfills-es5.js',
        './dist/alpdeskfee-client/main-es5.js',
    ]
    const files_es6 = [
        './mootoolscompat.js',
        './dist/alpdeskfee-client/runtime-es2015.js',
        './dist/alpdeskfee-client/polyfills-es2015.js',
        './dist/alpdeskfee-client/main-es2015.js',
    ]
    const files_css = [
        './contao.css',
        './dist/alpdeskfee-client/styles.css',
    ]
    await fs.ensureDir('elements')
    await concat(files_es5, 'elements/alpdeskfee-elements-es5.js');
    await concat(files_es6, 'elements/alpdeskfee-elements-es6.js');
    await concat(files_css, 'elements/alpdeskfee-styles.css');
    //await fs.copyFile('./dist/alpdeskfee-client/styles.css', 'elements/alpdeskfee-styles.css')
    //await fs.copy('./dist/angular-elements/assets/', 'elements/assets/')
})()
