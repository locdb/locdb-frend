import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Feed }       from './locdb'

@Injectable()
export class FeedService {

  // Observable string sources
  private emittedFeeds = new Subject<Feed>();
  private feeds: Feed[] = []

  // Observable string streams
  emittedFeeds$ = this.emittedFeeds.asObservable();

  // Service message commands
  pushFeed(feed: Feed) {
    console.log("feed in feedservice", feed)
    this.emittedFeeds.next(feed);
    this.feeds.push(feed)
  }

  resetFeeds(){
    this.emittedFeeds = new Subject<Feed>();
    this.feeds = []
  }

  fetchFeeds(): Feed[] {
    console.log("Feeds fetches: ", this.feeds)
    return this.feeds
  }
}
