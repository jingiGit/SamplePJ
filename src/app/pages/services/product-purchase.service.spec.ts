import { ErrorMessagingService } from 'src/app/core/services/error-messaging.service';
import { SuccessMessagingService } from 'src/app/core/services/success-messaging.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiConst } from '../constants/api-const';
import { ProductPurchaseRequestDto } from '../models/dtos/requests/product-purchase-request-dto';
import { ProductPurchaseResponseDto } from '../models/dtos/responses/product-purchase-response-dto';
import { ProductPurchaseService } from './product-purchase.service';

const VALUE_PRODUCT_CODE = 'productCode';
describe('ProductPurchaseService', () => {
  const expectedProductPurchaseResponseDto: ProductPurchaseResponseDto =
    createProductPurchaseResponseDto();

  let service: ProductPurchaseService;
  let httpTestingController: HttpTestingController;
  let successMessagingServiceSpy: {
    clearMessageProperty: jasmine.Spy;
    setMessageProperty: jasmine.Spy;
  };
  let errorMessagingServiceSpy: {
    clearMessageProperty: jasmine.Spy;
    setupPageErrorMessageFromResponse: jasmine.Spy;
  };

  beforeEach(() => {
    successMessagingServiceSpy = jasmine.createSpyObj(
      'SuccessMessagingService',
      ['clearMessageProperty', 'setMessageProperty']
    );
    errorMessagingServiceSpy = jasmine.createSpyObj('ErrorMessagingService', [
      'clearMessageProperty',
      'setupPageErrorMessageFromResponse',
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: SuccessMessagingService,
          useValue: successMessagingServiceSpy,
        },
        { provide: ErrorMessagingService, useValue: errorMessagingServiceSpy },
      ],
    });
    service = TestBed.inject(ProductPurchaseService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('#constractor', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('#getProductPurchase', () => {
    const webApiUrl =
      ApiConst.PATH_API_ROOT +
      ApiConst.PATH_PURCHASE +
      '?productCode=' +
      VALUE_PRODUCT_CODE;

    it('should return expected response', () => {
      service.getProductPurchase(VALUE_PRODUCT_CODE).subscribe((response) => {
        expect(response).toEqual(expectedProductPurchaseResponseDto);
        expect(
          errorMessagingServiceSpy.setupPageErrorMessageFromResponse.calls.count()
        ).toBe(0);
      }, fail);

      const req = httpTestingController.expectOne(webApiUrl);
      expect(req.request.method).toEqual('GET');
      expect(
        successMessagingServiceSpy.clearMessageProperty.calls.count()
      ).toBe(1);
      expect(errorMessagingServiceSpy.clearMessageProperty.calls.count()).toBe(
        1
      );

      // Respond with the mock
      req.flush(expectedProductPurchaseResponseDto);
    });

    it('should return null 404 Not Found', () => {
      const msg = '404 Not Found';
      service.getProductPurchase(VALUE_PRODUCT_CODE).subscribe((response) => {
        expect(response).toBeNull();
        expect(
          errorMessagingServiceSpy.setupPageErrorMessageFromResponse.calls.count()
        ).toBe(1);
      }, fail);

      const req = httpTestingController.expectOne(webApiUrl);
      expect(req.request.method).toEqual('GET');
      expect(
        successMessagingServiceSpy.clearMessageProperty.calls.count()
      ).toBe(1);
      expect(errorMessagingServiceSpy.clearMessageProperty.calls.count()).toBe(
        1
      );

      // Respond with the mock
      req.flush(msg, { status: 404, statusText: '404 Not Found' });
    });
  });

  describe('#createProductPurchase', () => {
    const productPurchaseRequestDto = createProductPurchaseRequestDto();
    const webApiUrl = ApiConst.PATH_API_ROOT + ApiConst.PATH_PURCHASE;

    it('should return expected response', () => {
      service
        .createProductPurchase(productPurchaseRequestDto)
        .subscribe((response) => {
          expect(response).toEqual(expectedProductPurchaseResponseDto);
          expect(
            successMessagingServiceSpy.setMessageProperty.calls.count()
          ).toBe(1);
          expect(
            errorMessagingServiceSpy.setupPageErrorMessageFromResponse.calls.count()
          ).toBe(0);
        }, fail);

      const req = httpTestingController.expectOne(webApiUrl);
      expect(req.request.method).toEqual('POST');
      expect(
        successMessagingServiceSpy.clearMessageProperty.calls.count()
      ).toBe(1);
      expect(errorMessagingServiceSpy.clearMessageProperty.calls.count()).toBe(
        1
      );

      // Respond with the mock
      req.flush(expectedProductPurchaseResponseDto);
    });

    it('should return null 404 Not Found', () => {
      const msg = '404 Not Found';
      service
        .createProductPurchase(productPurchaseRequestDto)
        .subscribe((response) => {
          expect(response).toBeNull();
          expect(
            successMessagingServiceSpy.setMessageProperty.calls.count()
          ).toBe(0);
          expect(
            errorMessagingServiceSpy.setupPageErrorMessageFromResponse.calls.count()
          ).toBe(1);
        }, fail);

      const req = httpTestingController.expectOne(webApiUrl);
      expect(req.request.method).toEqual('POST');
      expect(
        successMessagingServiceSpy.clearMessageProperty.calls.count()
      ).toBe(1);
      expect(errorMessagingServiceSpy.clearMessageProperty.calls.count()).toBe(
        1
      );

      // Respond with the mock
      req.flush(msg, { status: 404, statusText: '404 Not Found' });
    });
  });
});

function createProductPurchaseRequestDto(): ProductPurchaseRequestDto {
  const expectedProductPurchaseRequestDto: ProductPurchaseRequestDto = {
    productCode: VALUE_PRODUCT_CODE,
    productPurchaseName: 'productPurchaseName',
    productStockQuantity: 100,
    productPurchaseQuantity: 1,
  };
  return expectedProductPurchaseRequestDto;
}

function createProductPurchaseResponseDto(): ProductPurchaseResponseDto {
  const expectedProductPurchaseResponseDto: ProductPurchaseResponseDto = {
    productCode: VALUE_PRODUCT_CODE,
    productColor: 'productColor',
    productGenre: '1',
    productImage: 'productImage',
    productName: 'productName',
    productPurchaseUnitPrice: 1,
    productSizeStandard: 'productSizeStandard',
    productStockQuantity: 100,
  };
  return expectedProductPurchaseResponseDto;
}
