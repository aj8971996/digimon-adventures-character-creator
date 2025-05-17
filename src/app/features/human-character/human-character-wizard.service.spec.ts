import { TestBed } from '@angular/core/testing';

import { HumanCharacterWizardService } from './human-character-wizard.service';

describe('HumanCharacterWizardService', () => {
  let service: HumanCharacterWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HumanCharacterWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
