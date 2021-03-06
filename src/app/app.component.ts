import { Component, OnInit} from '@angular/core';

import { LocdbService } from './locdb.service';
import { FeedService } from './ingest/feed.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [ FeedService ]
})

/* Main App Component for whole LOCDB Frontend */
export class AppComponent implements OnInit {
  // feeds: Feed[];

  constructor(private feedService: FeedService) {

  }

  ngOnInit() {

  }

  // updateFeeds(event: Feed[]) {
  //   console.log('updateFeeds: ', event[1]);
  //   let f: any
  //   for (f of event) {
  //     console.log('send feed ', f)
  //     this.feedService.pushFeed(f)
  // }
}
