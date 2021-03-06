
import {map} from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { LocdbService } from '../../locdb.service';
import { FeedService } from '../feed.service';
import { models } from '../../locdb'
import { Http } from '@angular/http';

@Component({
  selector: 'app-feed',
  template: `
<div>
  <h5>{{data?.title}}</h5>
  <h6>{{data?.url}}</h6>
  <ul>
    <li *ngFor="let item of data?.entries">
      <a href="{{item.link}}">
        {{item.title}}
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
    this.http.get(this.rssToJsonServiceBaseUrl + encodeURIComponent("https://"+this.url), { withCredentials: false }).pipe(map(
    //this.http.get("https://" + this.url, { withCredentials: false }).map(
        res => res.json())).subscribe(
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
  styleUrls: ['./feed-reader.component.css'],
})
export class FeedReaderComponent implements OnInit {
  feeds: models.Feed[] = []
  title = "Feed Reader"

  constructor(private feedService: FeedService, private locdbService: LocdbService) {
    feedService.emittedFeeds$.subscribe(
      feed => {
        console.log("recieved feed ", feed)
        //this.feeds.push(feed);
      });
    this.feeds = feedService.fetchFeeds()
  }

  ngOnInit() {
    console.log('Feedreader says hi');
    // this.locdbService.fetchFeeds().subscribe(
    //   // Only for compiling TODO FIXME
    //   (res) => { this.feeds = res[0]; console.log("feeds: ", this.feeds) },
    //   // (res) => { this.feeds = res; console.log("feeds: ", this.feeds) },
    //   (err) => { console.log(err); console.log("feeds: ", this.feeds) }
    // )
    //mock me a feed
    // let feed: Feed = {_id: 'xy', name: 'test', url: 'http://rss.cnn.com/rss/edition.rss'};
    // this.feeds.push(feed)
  }

  addFeed(url: string, name?: string) {
    console.log("add feed: ", url)
    name = name ? name : 'UNK'
    this.locdbService.addFeed({name: name, url: url}).subscribe(
      (user) => { this.feeds = user.feeds },
      (err) => { console.log(err) }
    );
  }

  deleteFeed(feed: models.Feed) {
    this.locdbService.deleteFeed(feed._id).subscribe(
      (user) => { this.feeds = user.feeds },
      (err) => { console.log(err) }
    );

  }

}
