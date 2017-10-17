import { Component, OnInit, Input } from '@angular/core';
import { LocdbService } from '../locdb.service';
import { Feed } from '../locdb'
import { Http } from '@angular/http';

@Component({
  selector: 'app-feed',
  template: `
<div class="feed">
  <h3>{{data?.title}}</h3>
  <h3>{{data?.url}}</h3>
  <ul>
    <li *ngFor="let entry of data?.entries">
      <a href="{{entry.link}}">
        {{entry.title}}
      </a>
    </li>
  </ul>
</div>`
})
export class FeedComponent implements OnInit {
  @Input() url: string;
  data: {title: string, url: string, entries: {link: string, title: string}[] };

  constructor(private http: Http) {
  }

  ngOnInit() {
    console.log('Feed says hi');
    this.http.get(this.url).map(res => res.json()).subscribe(
      res => { this.data = res.responseData.feed; console.log(res); });
  }

}


@Component({
  selector: 'app-feed-reader',
  templateUrl: './feed-reader.component.html',
  styleUrls: ['./feed-reader.component.css']
})
export class FeedReaderComponent implements OnInit {
  feeds: Feed[] = [];

  constructor(
    private locdbService: LocdbService
  ) { }

  ngOnInit() {
    this.locdbService.fetchFeeds().subscribe(
      (res) => { this.feeds = res },
      (err) => { console.log(err) }
    )
  }

  addFeed(url: string, name?: string) {
    name = name ? name : 'UNK'
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
