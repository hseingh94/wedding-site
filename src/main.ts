import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App} from './app/app'; // This is looking for "App"

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
