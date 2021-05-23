import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

  onPitSelected(amount, index, player) {
    console.log(index, amount)

    if (player) {
      this.playerTurn = !this.playerTurn;

      amount = this.dealSeedsPlayer(index + 1, amount, true);
      this.playerSeeds[index] = 0;
      if (amount > 0) {
        amount--;
        this.playerAmount++;

        if (amount == 0) {
          //  last seed in endzone
          this.playerTurn = true;
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
        if (amount == 0) {
          //  last seed in endzone
          this.playerTurn = false;
        }
      }

      if (amount > 0) {
        amount = this.dealSeedsPlayer(0, amount);
      }

      if (amount > 0) {
        this.dealSeedsOpp(this.oppSeeds.length - 1, amount, true);
      }
    }
  }

  dealSeedsPlayer(index, amount, take = false) {

    for (let i = index; i < this.playerSeeds.length; i++) {
      amount--;
      this.playerSeeds[i]++;
      if (amount == 0) {
        if (take && this.playerSeeds[i] == 1 && this.oppSeeds[i] > 0) {
          debugger;

          this.playerAmount += this.playerSeeds[i] + this.oppSeeds[i];
          this.playerSeeds[i] = this.oppSeeds[i] = 0;
        }
        break;
      }
    }
    return amount;

  }



  dealSeedsOpp(index, amount, take = false) {

    for (let i = index; i > -1; i--) {
      if (amount == 0) {
        if (take && this.oppSeeds[i] == 1 && this.playerSeeds[i] > 0) {
          debugger;

          this.oppAmount += this.playerSeeds[i] + this.oppSeeds[i];
          this.playerSeeds[i] = this.oppSeeds[i] = 0;
        }
        break;
      }
      amount--;
      this.oppSeeds[i]++;

    }
    return amount;

  }
}
