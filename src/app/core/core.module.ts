import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';
import { NgxTranslateModule } from '../ngx-translate/ngx-translate.module';
import { ErrorMessagingComponent } from './components/error-messaging/error-messaging.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MatDatepickerComponent } from './components/mat-datepicker/mat-datepicker.component';
import { YesNoDialogComponent } from './components/yes-no-dialog/yes-no-dialog.component';
import { XhrInterceptor } from './interceptors/xhr.interceptor';
import { FormattedCurrencyPipe } from './pipes/formatted-currency.pipe';
import { FormattedNumberPipe } from './pipes/formatted-number.pipe';

@NgModule({
  declarations: [
    LoadingComponent,
    ErrorMessagingComponent,
    YesNoDialogComponent,
    FormattedNumberPipe,
    FormattedCurrencyPipe,
    MatDatepickerComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxTranslateModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true },
  ],
  entryComponents: [YesNoDialogComponent],
  exports: [
    LoadingComponent,
    ErrorMessagingComponent,
    YesNoDialogComponent,
    FormattedCurrencyPipe,
    FormattedNumberPipe,
    MatDatepickerComponent,
  ],
})
export class CoreModule {}
