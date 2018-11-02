import { Component, OnInit } from '@angular/core';

import { UtilsService } from '../typescript-angular-client/api/utils.service'

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {

  stats: any;

  statsTriggered = false;
  isRetrievingStats = false;

  constructor(private utilsService: UtilsService) { }

  ngOnInit() {
    // this.retrieveStats();
  }

  retrieveStats() {
    this.isRetrievingStats = true;
    console.log('Retrieving stats');
    this.utilsService.stats().subscribe(
      (stats) => { this.stats = stats; this.isRetrievingStats = false; },
      (error) => { alert('Error while retrieving stats:' + error.message); this.isRetrievingStats = false; }
    );
  }

  triggerStats() {
    this.statsTriggered = false;

    if (!confirm('This might take a while...')) { return; }

    this.utilsService.triggerStats().subscribe(
      (success) => { this.statsTriggered = true; this.retrieveStats(); },
      (error) => { alert('Triggering stats failed: ' + error.message); }
    );

  }
}
