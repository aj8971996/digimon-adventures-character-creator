import { TestBed } from '@angular/core/testing';

import { EvolutionLineManagerService } from './evolution-line-manager.service';

describe('EvolutionLineManagerService', () => {
  let service: EvolutionLineManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvolutionLineManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
