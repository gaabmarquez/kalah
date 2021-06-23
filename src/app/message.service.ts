import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Game } from './game/model/game.model';
declare var SockJS;
declare var Stomp;
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _myId = (new Date).getTime();
  private _newMove = new Subject<string>();
  constructor() {
    this.initializeWebSocketConnection();
  }
  public stompClient;
  public msg = [];

  initializeWebSocketConnection() {
    const ws = new SockJS(environment.backendURL);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/message', (message) => {
        if (message.body) {
          that._newMove.next(message.body)
        }
      });
    });
  }

  sendMessage(message: Game) {
    this.stompClient.send('/app/send/message', {}, JSON.stringify(message));
  }

  public newMoveEmitted(): Subject<string> {
    return this._newMove;
  }

  public getMyId() {
    return this._myId;
  }

}

