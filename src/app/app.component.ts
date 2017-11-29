import { Component, OnInit} from '@angular/core';

import { ToDo, ToDoParts, ToDoScans, BibliographicEntry, BibliographicResource } from './locdb';
import { LocdbService } from './locdb.service';
import { FeedService } from './feed.service';
import { Feed } from './locdb'
import { environment } from 'environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [ FeedService ]
})

/* Main App Component for whole LOCDB Frontend */
export class AppComponent implements OnInit {
  feeds: Feed[]

  constructor(private feedService: FeedService) {

  }

  ngOnInit() {

  }

  updateFeeds(event: Feed[]) {
    console.log('updateFeeds: ', event[1]);
    let f: any
    for (f of event) {
      console.log('send feed ', f)
      this.feedService.pushFeed(f)
  }
}

}
