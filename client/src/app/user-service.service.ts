import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IUser } from '../app/personal-info/user';
@Injectable()
export class UserService {
  private siblingMsg = new Subject<IUser>();
  constructor() { }
  /*
   * @return {Observable<string>} : siblingMsg
   */
  public getMessage(): Observable<IUser> {
    return this.siblingMsg.asObservable();
  }
  /*
   * @param {string} message : siblingMsg
   */
  public updateMessage(message: IUser): void {
    this.siblingMsg.next(message);
  }
}