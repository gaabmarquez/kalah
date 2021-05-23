import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pit',
  templateUrl: './pit.component.html',
  styleUrls: ['./pit.component.scss']
})
export class PitComponent implements OnInit, OnChanges {

  @Input() amount;
  @Input() disabled = false;
  @Input() endZone = false;
  @Output() pitSelected = new EventEmitter<number>();
  seeds;
  constructor() { }

  ngOnInit() {
    // this.seeds = new Array(this.amount)
  }
  ngOnChanges() {
    this.seeds = new Array(this.amount)

  }


  emit() {
    if (this.amount > 0)
      this.pitSelected.emit(this.amount)
  }
}
