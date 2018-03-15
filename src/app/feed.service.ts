import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { models }       from './locdb'

@Injectable()
export class FeedService {

  // Observable string sources
  private emittedFeeds = new Subject<models.Feed>();
  private feeds: models.Feed[] = []

  // Observable string streams
  emittedFeeds$ = this.emittedFeeds.asObservable();

  // Service message commands
  pushFeed(feed: models.Feed) {
    console.log("feed in feedservice", feed)
    this.emittedFeeds.next(feed);
    this.feeds.push(feed)
  }

  resetFeeds(){
    this.emittedFeeds = new Subject<models.Feed>();
    this.feeds = []
  }

  fetchFeeds(): models.Feed[] {
    console.log("Feeds fetches: ", this.feeds)
    return this.feeds
  }
}
