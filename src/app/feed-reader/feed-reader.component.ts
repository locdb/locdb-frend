import { Component, OnInit } from '@angular/core';
import { LocdbService } from '../locdb.service';
import { Feed } from '../locdb'

@Component({
  selector: 'app-feed-reader',
  templateUrl: './feed-reader.component.html',
  styleUrls: ['./feed-reader.component.css']
})
export class FeedReaderComponent implements OnInit {
  feeds: Feed[];

  constructor(
    private locdbService: LocdbService
  ) { }

  ngOnInit() {
    this.locdbService.fetchFeeds().subscribe(
      (res) => { this.feeds = res },
      (err) => { console.log(err) }
    )
  }

  addFeed(name: string, url: string) {
    this.locdbService.addFeed(name, url).subscribe(
      (suc) => { this.feeds.push(suc) },
      (err) => { console.log(err) }
    );
  }

  deleteFeed(feed: Feed) {
    this.locdbService.deleteFeed(feed._id).subscribe(
      (suc) => { this.feeds = suc },
      (err) => { console.log(err) }
    );

  }

}
