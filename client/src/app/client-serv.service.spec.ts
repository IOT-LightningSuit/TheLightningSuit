import { TestBed } from '@angular/core/testing';

import { ClientServService } from './client-serv.service';

describe('ClientServService', () => {
  let service: ClientServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
