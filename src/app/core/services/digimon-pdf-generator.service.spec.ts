import { TestBed } from '@angular/core/testing';

import { DigimonPdfGeneratorService } from './digimon-pdf-generator.service';

describe('DigimonPdfGeneratorService', () => {
  let service: DigimonPdfGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigimonPdfGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
