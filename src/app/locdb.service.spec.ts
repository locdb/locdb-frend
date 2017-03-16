import { TestBed, inject } from '@angular/core/testing';

import { LocdbService } from './locdb.service';

describe('LocdbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocdbService]
    });
  });

  it('should ...', inject([LocdbService], (service: LocdbService) => {
    expect(service).toBeTruthy();
  }));
});
