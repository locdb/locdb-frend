import { Component, OnInit, Input } from '@angular/core';
import { LocdbService } from '../locdb.service';
import { Feed } from '../locdb'
import { Http } from '@angular/http';

@Component({
  selector: 'app-feed',
  template: `
<div class="feed">
  <h3>{{data?.feed.title}}</h3>
  <h5>{{data?.feed.url}}</h5>
  <ul>
    <li *ngFor="let entry of data?.items">
      <a href="{{entry.link}}">
        {{entry.title}}
      </a>
    </li>
  </ul>
</div>`
})
export class FeedComponent implements OnInit {
  title = 'Feed Reader';
  @Input() url: string;
  data: {title: string, url: string, entries: {link: string, title: string}[] };
  private rssToJsonServiceBaseUrl: string = 'https://rss2json.com/api.json?rss_url=';

  constructor(private http: Http) {
    console.log("Feed reader: ", http)
  }

  ngOnInit() {
    console.log('Feed says hi', this.http);
    console.log("URL: ", this.rssToJsonServiceBaseUrl + encodeURIComponent(this.url))
    this.http.get(this.rssToJsonServiceBaseUrl + encodeURIComponent("https://"+this.url), { withCredentials: false }).map(
      res => res.json()).subscribe(
        (res) => this.processFeedJson(res)
      );
}
  processFeedJson(res: any){
    console.log("res: ", res);
    if (res.status == "ok"){
      this.data = res
    }
    else{
      console.log("Could not get rss feeds: ", res.message)
  }
  }

}

@Component({
  selector: 'app-feed-reader',
  templateUrl: './feed-reader.component.html',
  styleUrls: ['./feed-reader.component.css']
})
export class FeedReaderComponent implements OnInit {
  @Input() feeds: Feed[]
  title = "Feed Reader"

  constructor(
    private locdbService: LocdbService
  ) { }

  ngOnInit() {
    console.log('Feedreader says hi');
    this.locdbService.fetchFeeds().subscribe(
      (res) => { this.feeds = res; console.log("feeds: ", this.feeds) },
      (err) => { console.log(err); console.log("feeds: ", this.feeds) }
    )
    //mock me a feed
    // let feed: Feed = {_id: 'xy', name: 'test', url: 'http://rss.cnn.com/rss/edition.rss'};
    // this.feeds.push(feed)
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
