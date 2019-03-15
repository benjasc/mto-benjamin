import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrls: ['./block-info.component.scss']
})
export class BlockInfoComponent implements OnInit {
  private iconPercentage: any;
  @Input() title: string;
  @Input() number: number;
  @Input() percent: number;
  @Input() failed: number;

  constructor() { }

  ngOnInit() {
    this.iconPercentage = this.percentage(this.percent);
  }

  public percentage(value) {
    if (value >= 100) {
      return 'color-up';
    } else {
      return 'color-down';
    }
  }

}
