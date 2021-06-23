import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NotificationAnimationType, NotificationsService, Options } from 'angular2-notifications';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {


  @Input() playerBAmount = 0;
  @Input() playerAAmount = 0;
  @Input() playerASeeds;
  @Input() playerBSeeds;
  @Input() playerATurn;
  @Input() winner;

  @Output() moveEnded = new EventEmitter<any>();
  @Output() notificationEmitted = new EventEmitter<any>();
  capturedSeeds = false;

  notifOptions: Options = {
    position: ['top', 'right'],
    timeOut: 2000,
    clickToClose: true,
    showProgressBar: false,
    animate: NotificationAnimationType.FromRight,
    theClass: 'notification'

  };

  onPitSelected(amount, index, player) {
    this.capturedSeeds = false;
    // if (player) {
    this.playerATurn = !this.playerATurn;

    amount = this.dealSeedsPlayer(index + 1, amount, true);
    this.playerASeeds[index] = 0;
    if (amount > 0) {
      amount--;
      this.playerAAmount++;

      if (amount == 0 && this.playerASeeds.reduce((a, b) => a + b) > 0) {
        //  last seed in endzone
        this.playerATurn = true;
        this.notificationEmitted.emit('Player repeat turn')
      }
    }

    if (amount > 0) {
      amount = this.dealSeedsPlayerB(this.playerBSeeds.length - 1, amount);
    }

    if (amount > 0) {
      this.dealSeedsPlayer(0, amount), true;
    }


    if (this.isEndOfGame()) {
      this.playerAAmount += this.playerASeeds.reduce((a, b) => a + b);
      this.playerBAmount += this.playerBSeeds.reduce((a, b) => a + b);

      this.playerBSeeds = this.playerASeeds = new Array(6).fill(0)

      this.announceWinner();
    }
    this.sendInfo();
  }

  sendInfo() {

    this.moveEnded.emit({
      playerASeeds: this.playerASeeds,
      playerBSeeds: this.playerBSeeds,
      playerAAmount: this.playerAAmount,
      playerBAmount: this.playerBAmount,
      repeatTurn: this.playerATurn,
      capturedSeeds: this.capturedSeeds,
      winner: this.winner
    });

  }
  announceWinner() {
    if (this.playerAAmount > this.playerBAmount) {
      this.winner = 'Player';
    }
    else if (this.playerAAmount < this.playerBAmount) {
      this.winner = 'Opponent';
    }
    else {
      this.winner = 'Tie';
    }

  }

  isEndOfGame() {
    return this.playerBSeeds.reduce((a, b) => a + b) == 0 ||
      this.playerASeeds.reduce((a, b) => a + b) == 0;
  }

  dealSeedsPlayer(index, amount, take = false) {

    for (let i = index; i < this.playerASeeds.length; i++) {
      amount--;
      this.playerASeeds[i]++;
      if (amount == 0) {
        if (take && this.playerASeeds[i] == 1 && this.playerBSeeds[i] > 0) {
          this.playerAAmount += this.playerASeeds[i] + this.playerBSeeds[i];
          this.playerASeeds[i] = this.playerBSeeds[i] = 0;


          this.notificationEmitted.emit("You captured opponent's seeds");
          this.capturedSeeds = true;


        }
        break;
      }
    }
    return amount;

  }


  dealSeedsPlayerB(index, amount, take = false) {

    for (let i = index; i > -1; i--) {
      amount--;
      this.playerBSeeds[i]++;
      if (amount == 0) {
        if (take && this.playerBSeeds[i] == 1 && this.playerASeeds[i] > 0) {

          this.playerBAmount += this.playerASeeds[i] + this.playerBSeeds[i];
          this.playerASeeds[i] = this.playerBSeeds[i] = 0;
        }
        break;
      }

    }
    return amount;

  }
}
