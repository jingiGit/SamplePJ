import { Observable } from 'rxjs';
import { RegexConst as RegexConstCore } from 'src/app/core/constants/regex-const';
import { FormattedCurrencyPipe } from 'src/app/core/pipes/formatted-currency.pipe';
import { LoadingService } from 'src/app/core/services/loading.service';
import { RoutingService } from 'src/app/core/services/routing.service';
import { RegexConst } from 'src/app/pages/constants/regex-const';
import { TitleI18Service } from 'src/app/shared/services/title-i18.service';

import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UrlConst } from '../../constants/url-const';
import { AccountService } from '../../services/account.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-registering-page',
  templateUrl: './product-registering-page.component.html',
  styleUrls: ['./product-registering-page.component.scss'],
})
export class ProductRegisteringPageComponent
  implements OnInit, AfterViewChecked
{
  productSeq = new FormControl('');
  productCode = new FormControl('', [
    Validators.required,
    Validators.pattern(RegexConstCore.SINGLE_BYTE_ALPHANUMERIC),
  ]);
  productName = new FormControl('', [Validators.required]);
  productGenre = new FormControl('', [Validators.required]);
  productSizeStandard = new FormControl('', [Validators.required]);
  productColor = new FormControl('');
  productUnitPrice = new FormControl('', [
    Validators.required,
    Validators.min(1),
    Validators.max(99999999),
    Validators.pattern(RegexConstCore.SINGLE_BYTE_NUMERIC_COMMA_PERIOD_SPACE),
  ]);
  endOfSale = new FormControl(false);
  endOfSaleDate = new FormControl('');
  productImage = new FormControl(null);
  updateDate = new FormControl(null);

  registeringForm = this.formBuilder.group({
    productSeq: this.productSeq,
    productCode: this.productCode,
    productName: this.productName,
    productGenre: this.productGenre,
    productSizeStandard: this.productSizeStandard,
    productColor: this.productColor,
    productUnitPrice: this.productUnitPrice,
    endOfSale: this.endOfSale,
    endOfSaleDate: this.endOfSaleDate,
    productImage: this.productImage,
    updateDate: this.updateDate,
  });

  /** Locale, Currency */
  locale: string = this.accountService.getUser().userLocale;
  currency: string = this.accountService.getUser().userCurrency;

  /** Select item of genre */
  genres: string[];

  /** FileInput */
  @ViewChild('fileInputElement', { static: false })
  public fileInputElement: ElementRef;

  /** Title and button text */
  messagePropertytitle = 'productRegisteringPage.title.new';
  messagePropertySaveButton = 'productRegisteringPage.saveButton.new';

  /** Called new or update? */
  isNew =
    this.routingService.router.url ===
    UrlConst.SLASH + UrlConst.PATH_PRODUCT_REGISTERING_NEW;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private productService: ProductService,
    private accountService: AccountService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private formattedCurrencyPipe: FormattedCurrencyPipe,
    private titleI18Service: TitleI18Service,
    public translateService: TranslateService
  ) {}

  /**
   * on init
   */
  ngOnInit(): void {
    this.loadData();
    this.setupLanguage();
    if (!this.isNew) {
      this.setupUpdateMode();
      this.getProduct();
    }
  }

  /**
   * after view checked
   */
  ngAfterViewChecked(): void {
    this.titleI18Service.setTitle(UrlConst.PATH_PRODUCT_REGISTERING);
  }

  /**
   * Clicks product image button
   * @param files image file list
   */
  clickProductImageButton(files: FileList): void {
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(RegexConst.MIME_TYPE_FILE_UPLOAD) == null) {
      return;
    }
    this.readFile(files[0]).subscribe((result) => {
      this.productImage.setValue(result);
    });
  }

  /**
   * Clicks clear button
   */
  clickClearButton(): void {
    this.fileInputElement.nativeElement.value = '';
    this.productImage.setValue(null);
  }

  /**
   * Clicks return button
   */
  clickReturnButton(): void {
    this.routingService.router.navigate([UrlConst.PATH_PRODUCT_LISTING]);
  }

  /**
   * Clicks save button
   */
  clickSaveButton(): void {}

  /**
   * Received event from child
   * @param eventData entered end of sele date
   */
  receivedEventFromChild(eventData: string): void {
    this.endOfSaleDate.setValue(eventData);
  }

  /**
   * Resets end of sale date
   */
  resetEndOfSaleDate(): void {
    this.endOfSaleDate.setValue('');
  }
  // --------------------------------------------------------------------------------
  // private methods
  // --------------------------------------------------------------------------------
  private loadData(): void {
    this.productService.getGenres().subscribe((data) => (this.genres = data));
  }

  private setupLanguage(): void {
    const lang = this.accountService.getUser().userLanguage;
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
  }

  private readFile(file: File): Observable<string> {
    const observable = new Observable<string>((subscriber) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content: string = reader.result as string;
        subscriber.next(content);
        subscriber.complete();
      };
      reader.readAsDataURL(file);
    });
    return observable;
  }

  private getProduct(): void {}

  private setupUpdateMode(): void {
    this.messagePropertytitle = 'productRegisteringPage.title.edit';
    this.messagePropertySaveButton = 'productRegisteringPage.saveButton.edit';
  }
}
