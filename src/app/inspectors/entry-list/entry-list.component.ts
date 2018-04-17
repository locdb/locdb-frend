import {
  OnDestroy,
  Component,
  SimpleChanges,
  OnInit,
  OnChanges,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { models, TypedResourceView } from '../../locdb'
import { Observable } from 'rxjs/Rx';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LoggingService } from '../../logging.service'

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})

export class EntryListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() resource: TypedResourceView;
  @Input() entries: models.BibliographicEntry[];
  selectedEntry: models.BibliographicEntry;
  // first argument : true makes event emitter async
  // necessary to avoid ChangeDetection errors
  @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter(true);


  constructor(private _hotkeysService: HotkeysService, private loggingService: LoggingService) {
  }

  ngOnInit() {
    this._hotkeysService.add(new Hotkey('j', (event: KeyboardEvent): boolean => {
      let current = this.entries.indexOf(this.selectedEntry);
      if (current === -1 || current >= this.entries.length - 1) { return false }; // guard
      console.log('current', current, 'of', this.entries.length);
      current += 1;
      this.onSelectReference(this.entries[current]);
      return false;
    }, [], 'one entry downward'));
    this._hotkeysService.add(new Hotkey('k', (event: KeyboardEvent): boolean => {
      let current = this.entries.indexOf(this.selectedEntry);
      if (current === -1 || current <= 0) { return false };  // guard
      current -= 1;
      this.onSelectReference(this.entries[current]);
      return false;
    }, [], 'one entry upward'));
  }

  ngOnChanges(changes: SimpleChanges | any) {
    if (!this.entries || !this.entries.length) { return; } // guard
    setTimeout(() => {
      this.selectedEntry = this.entries.find(e => !e.references);
      this.entry.emit(this.selectedEntry);
      console.log('first unlinked entry emitted', this.selectedEntry)
    });
  }

  ngOnDestroy() {
    for (const combo of ['j', 'k']) {
        const hk = this._hotkeysService.get(combo)
        this._hotkeysService.remove(hk);
    }
  }


  addEntry() {
    //const entry = new BibliographicEntry();
    console.log('missing implementation')
    //this.onSelectReference(entry);
  }

  deleteEntry() {

  }

  onSelectReference(entry: models.BibliographicEntry) {
    if (this.selectedEntry === entry) { return; } // guard
    this.loggingService.logReferenceSelected(entry)
    this.selectedEntry = entry;
    // console.log('entry emitted', entry)
    this.entry.emit(entry)
  }

}
