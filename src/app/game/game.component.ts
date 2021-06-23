import { Component, OnInit } from '@angular/core';
import { Options, NotificationAnimationType, NotificationsService } from 'angular2-notifications';
import { MessageService } from '../message.service';
import { Game } from './model/game.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  playerATurn = false;
  currentGame: Game = undefined;
  gameInitialized = false;
  winner = ''

  notifOptions: Options = {
    position: ['top', 'right'],
    timeOut: 1000,
    clickToClose: true,
    showProgressBar: false,
    animate: NotificationAnimationType.FromRight,
    theClass: 'notification'

  };

  constructor(private messageService: MessageService,
    private notificationService: NotificationsService) { }



  ngOnInit() {
    this.messageService.newMoveEmitted().subscribe(msg => {
      const game: Game = JSON.parse(msg);
      if (game.playerAId && game.playerBId) {
        this.gameInitialized = true;
      }
      if (game.senderId !== this.messageService.getMyId()) {
        this.currentGame = this.parseGame(game);
        this.playerATurn = this.currentGame.currentTurn === this.messageService.getMyId();

        if (game.opponentRepeatTurn) {
          this.onNotificationEmitted('Opponent repeats turn!')
        }
        if (game.capturedSeeds) {
          this.onNotificationEmitted('Opponent captured your seeds!')
        }
        if (game.winner.trim() != '') {
          this.currentGame = undefined;
          if (game.winner !== 'Tie') {
            this.winner = game.winner == 'Player' ? 'Opponent' : 'Player';

          } else {
            this.winner = game.winner;
          }

        }
      }

    }, err => console.log(err));


  }
  // transform received data to display it correctly for both players
  private parseGame(game: Game) {
    let newGame: Game = { ...game };
    newGame.playerAAmount = game.playerBAmount;
    newGame.playerBAmount = game.playerAAmount;
    newGame.playerASeeds = [...game.playerBSeeds].reverse();
    newGame.playerBSeeds = [...game.playerASeeds].reverse();

    return newGame;
  }
  joined = false;

  joinGame() {
    this.joined = true;
    this.winner = '';
    let currentTurn;
    let playerAId;
    let playerBId;

    if (this.currentGame) {
      playerAId = this.currentGame.playerAId;
      playerBId = this.messageService.getMyId();
      currentTurn = this.currentGame.currentTurn;
    } else {
      currentTurn = this.messageService.getMyId();
      playerAId = this.messageService.getMyId();
    }

    const gameToSend: Game = {
      playerAId: playerAId,
      playerBId: playerBId,
      playerAAmount: 0,
      playerBAmount: 0,
      playerASeeds: new Array(6).fill(4),
      playerBSeeds: new Array(6).fill(4),
      senderId: this.messageService.getMyId(),
      currentTurn: currentTurn,
      opponentRepeatTurn: false,
      capturedSeeds: false,
      winner: ''

    };
    this.messageService.sendMessage(gameToSend);
  }

  onMoveEnded(data: {
    playerAAmount: number,
    playerBAmount: number,
    playerASeeds: number[],
    playerBSeeds: number[],
    capturedSeeds: boolean,
    winner: string,
    repeatTurn: boolean
  }) {
    let currentTurn = this.currentGame.currentTurn;

    if (!data.repeatTurn) {
      currentTurn = this.currentGame.currentTurn === this.currentGame.playerAId ? this.currentGame.playerBId : this.currentGame.playerAId
    }
    this.playerATurn = currentTurn === this.messageService.getMyId();


    this.messageService.sendMessage({
      playerAId: this.currentGame.playerAId,
      playerBId: this.currentGame.playerBId,
      playerAAmount: data.playerAAmount,
      playerBAmount: data.playerBAmount,
      playerASeeds: data.playerASeeds,
      playerBSeeds: data.playerBSeeds,
      senderId: this.messageService.getMyId(),
      currentTurn: currentTurn,
      opponentRepeatTurn: data.repeatTurn,
      capturedSeeds: data.capturedSeeds,
      winner: data.winner
    });

    if (data.winner.trim() != '') {
      this.winner = data.winner;
      this.currentGame = undefined;
    }
  }

  onNotificationEmitted(text) {
    this.notificationService.info('', text, {
      theClass: ' notification'

    })
  }
}
