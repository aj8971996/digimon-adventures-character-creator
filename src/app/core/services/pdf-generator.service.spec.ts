import { TestBed } from '@angular/core/testing';

import { PdfExportService } from './pdf-generator.service';

describe('PdfGeneratorService', () => {
  let service: PdfExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
