import 'zone.js'; // Required for Angular
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import AppModule from './app/app.module';

Office.initialize = reason => {
    console.log('reason', reason);
    document.getElementById('sideload-msg').style.display = 'none';

    // Bootstrap the app
    platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.error(error));
};