import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent} from './app/app'; // This is looking for "App"

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
