import { Component, OnInit } from '@angular/core';
import { NotificationAnimationType, NotificationsService, Options } from 'angular2-notifications';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  oppAmount = 0;
  playerAmount = 0;
  playerSeeds = new Array(6).fill(4);
  oppSeeds = new Array(6).fill(4);
  playerTurn = true;


  notifOptions: Options = {
    position: ['top', 'right'],
    timeOut: 1000,
    clickToClose: true,
    showProgressBar: false,
    animate: NotificationAnimationType.FromRight,
    theClass: 'notification'

  };



  constructor(private notificationService: NotificationsService) { }


  ngOnInit() {

  }

  onPitSelected(amount, index, player) {

    if (player) {
      this.playerTurn = !this.playerTurn;

      amount = this.dealSeedsPlayer(index + 1, amount, true);
      this.playerSeeds[index] = 0;
      if (amount > 0) {
        amount--;
        this.playerAmount++;

        if (amount == 0 && this.playerSeeds.reduce((a, b) => a + b) > 0) {
          //  last seed in endzone
          this.playerTurn = true;

          this.notificationService.info('', "Player repeat turn", {
            theClass: ' notification'

          })
        }
      }

      if (amount > 0) {
        amount = this.dealSeedsOpp(this.oppSeeds.length - 1, amount);
      }

      if (amount > 0) {
        this.dealSeedsPlayer(0, amount), true;
      }

    } else {

      this.playerTurn = !this.playerTurn;

      amount = this.dealSeedsOpp(index - 1, amount, true);
      this.oppSeeds[index] = 0;

      if (amount > 0) {
        amount--;
        this.oppAmount++;
        if (amount == 0 && this.oppSeeds.reduce((a, b) => a + b) > 0) {
          //  last seed in endzone
          this.playerTurn = false;
          this.notificationService.info('', "Opponent repeat turn", {
            theClass: ' notification'

          })
        }
      }

      if (amount > 0) {
        amount = this.dealSeedsPlayer(0, amount);
      }

      if (amount > 0) {
        this.dealSeedsOpp(this.oppSeeds.length - 1, amount, true);
      }
    }
    if (this.isEndOfGame()) {
      this.playerAmount += this.playerSeeds.reduce((a, b) => a + b);
      this.oppAmount += this.oppSeeds.reduce((a, b) => a + b);

      this.oppSeeds = this.playerSeeds = new Array(6).fill(0)

      this.announceWinner();
    }
  }

  announceWinner() {
    if (this.playerAmount > this.oppAmount) {

      this.notificationService.success('', "Player win!", {
        theClass: ' notification'

      })
    }
    else if (this.playerAmount < this.oppAmount) {

      this.notificationService.success('', "Opponents win!", {
        theClass: ' notification'

      })
    }
    else {

      this.notificationService.success('', "Tie", {
        theClass: ' notification'

      })
    }
  }

  isEndOfGame() {
    return this.oppSeeds.reduce((a, b) => a + b) == 0 ||
      this.playerSeeds.reduce((a, b) => a + b) == 0;
  }

  dealSeedsPlayer(index, amount, take = false) {

    for (let i = index; i < this.playerSeeds.length; i++) {
      amount--;
      this.playerSeeds[i]++;
      if (amount == 0) {
        if (take && this.playerSeeds[i] == 1 && this.oppSeeds[i] > 0) {
          this.playerAmount += this.playerSeeds[i] + this.oppSeeds[i];
          this.playerSeeds[i] = this.oppSeeds[i] = 0;

          this.notificationService.info('', "Player take opponent's seeds", {
            theClass: ' notification'

          })
        }
        break;
      }
    }
    return amount;

  }



  dealSeedsOpp(index, amount, take = false) {

    for (let i = index; i > -1; i--) {
      amount--;
      this.oppSeeds[i]++;
      if (amount == 0) {
        if (take && this.oppSeeds[i] == 1 && this.playerSeeds[i] > 0) {
          debugger;

          this.oppAmount += this.playerSeeds[i] + this.oppSeeds[i];
          this.playerSeeds[i] = this.oppSeeds[i] = 0;

          this.notificationService.info('', "Opponent take players's seeds", {
            theClass: ' notification'

          })
        }
        break;
      }

    }
    return amount;

  }
}
