import { TestBed } from '@angular/core/testing';

import { CachedDatabaseService } from './cached-database.service';

describe('CachedDatabaseService', () => {
  let service: CachedDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachedDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
