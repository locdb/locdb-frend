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
import { BibliographicEntry } from '../locdb'
import { Observable } from 'rxjs/Rx';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['../locdb.css', './entry-list.component.css']
})

export class EntryListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() entries: BibliographicEntry[];
  selectedEntry: BibliographicEntry;
  // first argument : true makes event emitter async
  // necessary to avoid ChangeDetection errors
  @Output() entry: EventEmitter<BibliographicEntry> = new EventEmitter(true);


  constructor(private _hotkeysService: HotkeysService) {
    this._hotkeysService.add(new Hotkey('j', (event: KeyboardEvent): boolean => {
      let current = this.entries.indexOf(this.selectedEntry);
      if (current === -1) { return false }; // not in array
      current = current >= this.entries.length ? this.entries.length - 1 : current + 1;
      this.onSelect(this.entries[current]);
      return false;
    }, [], 'one entry downward'));
    this._hotkeysService.add(new Hotkey('k', (event: KeyboardEvent): boolean => {
      let current = this.entries.indexOf(this.selectedEntry);
      if (current === -1) { return false }; // not in array
      current = current <= 0 ? 0 : current - 1;
      this.onSelect(this.entries[current]);
      return false;
    }, [], 'one entry upward'));

  }

  ngOnInit() {
    console.log('ngOnInit in entry-list');
  }

  ngOnChanges(changes: SimpleChanges | any) {
    console.log('ngOnChanges in entry-list');
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
    const entry = new BibliographicEntry();
    this.onSelect(entry);
  }

  deleteEntry() {

  }

  onSelect(entry: BibliographicEntry) {
    this.selectedEntry = entry;
    console.log('entry emitted', entry)
    this.entry.emit(entry)
  }

}
