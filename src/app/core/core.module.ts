import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '../material/material.module';
import { ErrorMessagingComponent } from './components/error-messaging/error-messaging.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [LoadingComponent, ErrorMessagingComponent],
  imports: [CommonModule, MaterialModule],
  exports: [LoadingComponent, ErrorMessagingComponent],
})
export class CoreModule {}
