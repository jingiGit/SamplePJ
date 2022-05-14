import { map, merge, startWith, switchMap } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { RoutingService } from 'src/app/core/services/routing.service';
import { TitleI18Service } from 'src/app/shared/services/title-i18.service';

import { HttpParams } from '@angular/common/http';
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

import { UrlConst } from '../../constants/url-const';
import {
    ProductListingSearchParamsDto
} from '../../models/dtos/requests/product-listing-search-params-dto';
import { ProductSearchResponseDto } from '../../models/dtos/responses/product-search-response-dto';
import { AccountService } from '../../services/account.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-registering-page',
  templateUrl: './product-listing-page.component.html',
  styleUrls: ['./product-listing-page.component.scss'],
})
export class ProductListingPageComponent implements OnInit, AfterViewChecked {
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private productService: ProductService,
    private routingService: RoutingService,
    private titleI18Service: TitleI18Service,
    public translateService: TranslateService
  ) {}

  productName = new FormControl('', []);
  productCode = new FormControl('', []);
  productGenre = new FormControl('', []);
  endOfSale = new FormControl(false, []);

  searchForm = this.formBuilder.group({
    productName: this.productName,
    productCode: this.productCode,
    productGenre: this.productGenre,
    endOfSale: this.endOfSale,
  });

  /** Locale, Currency */
  locale: string = this.accountService.getUser().userLocale;
  currency: string = this.accountService.getUser().userCurrency;

  /** Select item of genre */
  genres: string[];

  /** Material table's header */
  displayColumns: string[] = [
    'no',
    'productName',
    'productCode',
    'productGenre',
    'productImage',
    'productSizeStandard',
    'productColor',
    'productUnitPrice',
    'productStockQuantity',
    'endOfSale',
  ];

  /** Search result */
  productSearchResponseDtos: ProductSearchResponseDto[];
  resultsLength = 0;

  /** Paginator */
  @ViewChild(MatPaginator)
  public paginator: MatPaginator;
  initialPageSize = 50;

  /**
   * on init
   */
  ngOnInit(): void {
    this.loadData();
    this.setupLanguage();
  }

  /**
   * after view checked
   */
  ngAfterViewChecked(): void {
    this.titleI18Service.setTitle(UrlConst.PATH_PRODUCT_LISTING);
  }

  /**
   * Clicks new button
   */
  clickNewButton(): void {
    this.routingService.navigate(UrlConst.PATH_PRODUCT_REGISTERING_NEW);
  }

  /**
   * Clicks clear button
   */
  clickClearButton(): void {
    this.clearSearchConditions();
    this.clearSearchResultList();
  }

  /**
   * Clicks search button
   */
  clickSearchButton(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loadingService.startLoading();
          const productListingSearchParamsDto: ProductListingSearchParamsDto =
            this.createSearchParamsDto();

          return this.productService.getProductList(
            this.createHttpParams(productListingSearchParamsDto)
          );
        }),
        map((data) => {
          this.loadingService.stopLoading();
          this.resultsLength = data.resultsLength;
          if (this.paginator.pageIndex !== data.pageIndex) {
            this.paginator.pageIndex = data.pageIndex;
          }

          return data.productSearchResponseDtos;
        })
      )
      .subscribe((data) => (this.productSearchResponseDtos = data));
  }

  /**
   * Clicks list row
   * @param productSearchResponseDto Product search response dto
   */
  clickListRow(productSearchResponseDto: ProductSearchResponseDto): void {
    this.routingService.router.navigate([
      UrlConst.PATH_PRODUCT_REGISTERING,
      productSearchResponseDto.productCode,
    ]);
  }

  /**
   * Unselects product genre
   */
  unselectProductGenre(): void {
    this.productGenre.setValue('');
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

  private createSearchParamsDto(): ProductListingSearchParamsDto {
    const productListingSearchParamsDto: ProductListingSearchParamsDto = {
      productName: this.productName.value,
      productCode: this.productCode.value,
      productGenre: this.productGenre.value,
      endOfSale: this.endOfSale.value,
      pageSize: this.paginator.pageSize,
      pageIndex: this.paginator.pageIndex,
    };
    return productListingSearchParamsDto;
  }

  private createHttpParams(
    productListingSearchParamsDto: ProductListingSearchParamsDto
  ): HttpParams {
    const paramsOptions = { fromObject: productListingSearchParamsDto } as any;
    const params = new HttpParams(paramsOptions);
    return params;
  }

  private clearSearchConditions(): void {
    this.productName.setValue('');
    this.productCode.setValue('');
    this.productGenre.setValue('');
    this.endOfSale.setValue(false);
    this.paginator.pageSize = this.initialPageSize;
    this.paginator.pageIndex = 0;
  }

  private clearSearchResultList(): void {
    this.productSearchResponseDtos = null;
    this.resultsLength = 0;
  }
}
