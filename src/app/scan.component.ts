import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Citation } from './citation';
import { REFERENCES, REFERENCES_ALT } from './mock-references';
// import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { LocdbService } from './locdb.service';

const URL = '/api/'; // Same Origin Policy

@Component({
  moduleId: module.id,
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  providers: [ LocdbService ]
})

export class ScanComponent {
  title = 'File Upload';
  event: any;
  files: any;

  ppn: string;
  firstpage: number;
  lastpage: number;
  resourceType: string = "MONOGRAPH"; // needs to be value of select block

  listoffiles: MetaData[] = [];
  listoffilescontents = [];

  active: number;
  fileIsActive = false;
  isActive = false;
  activefile = 0;

  constructor ( private locdbService: LocdbService ) { }

  toggle() {
    this.isActive = !this.isActive;
  }

  togglefile() {
    this.fileIsActive = !this.fileIsActive;
  }

  onclickupload() { // check if content is set
    if (this.fileIsActive) {
      this.saveentries();
    }
    let ready = true;
    if (this.listoffiles !== []) {
      for (const file of this.listoffiles){
        if (!file.allset) {
          ready = false;
        }
      }
    }
    if (ready) {
      console.log('Ready for upload..');
      this.listoffiles.map((elem) => this.writefilecontent(elem));
      // clear after upload
      this.onclickclear();
    } else {
      alert('Files not ready!');
    }
  }

  onclickclear() {
    this.files = '';
    this.listoffiles = [];
  }

  onChange(event: any) { // file input
    this.files = '';
    this.files = event.target.files; // this.uploader.queue;
    // we do we have this.files and this.listoffiles? TODO
    let file: any;
    for (file of this.files){
      const [ppn, first, last] = this.extractPPNandPages(file.name);
      this.listoffiles.push(
        { ppn: ppn, firstpage: first, lastpage: last, file: file, filecontent
          : null, allset: ppn != null && first != null && last != null, resourceType: null}
      );
    }
  }

  onSelectFile(i: number) {
    if (this.fileIsActive) {
      this.saveentries();
      this.fileIsActive = true;
    }

    if (i === this.active || !this.fileIsActive) {
      this.togglefile();
    }

    this.active = i;

      this.ppn = this.listoffiles[i].ppn;
      this.firstpage = this.listoffiles[i].firstpage;
      this.lastpage = this.listoffiles[i].lastpage;
  }


  extractPPNandPages(name: any) {
    // do same magic
    // let re = /(?:\.([^.]+))?$/;
    const ppn_re = /([0-9]{8}[0-9X])/;
    console.log('extracting ppn and pages from filename');
    let id = null;
    try {
      const match = ppn_re.exec(name)
      id = match[0];
    } catch (err) { console.log(err); }
    const pages_re = /([1-9]+)[-_+]([1-9]+)/;
    let first = null, last = null;
    try {
      const match = pages_re.exec(name);
      first = match[1]; // match[0] is the whole match
      last = match[2];
    } catch (err) { console.log(err); }
    console.log('extracted:', id, first, last)

    // some more maybe?
    return [id, first, last];
  }

  // nicht mehr als onclick genutzt
  saveentries() {
    this.fileIsActive = false;
    this.listoffiles[this.active].ppn = this.ppn ;
    this.listoffiles[this.active].firstpage = this.firstpage;
    this.listoffiles[this.active].lastpage = this.lastpage;
    this.listoffiles[this.active].resourceType = this.resourceType;
    if (
      this.listoffiles[this.active].ppn && this.listoffiles[this.active].firstpage &&
      this.listoffiles[this.active].lastpage && this.listoffiles[this.active].resourceType
    ) {
      this.listoffiles[this.active].allset = true;
    }
    // } else {
    // console.log('FLUP: Invalid PPN or no firstpage or no lastpage set'); // throw error
    // }
  }

  readURL(input, i) {
    if (input.files && input.files[i]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        console.log((<IDBOpenDBRequest>e.target).result);
        // this.src = (<IDBOpenDBRequest>e.target).result;
      }

      reader.readAsDataURL(input.files[i]);
    } else {
      console.log('files out of bounds');
    }
  }

  writefilecontent(listelement: MetaData) {

    if (listelement.file) {
      console.log('Trying to Read');
      const r = new FileReader();

      r.onload = (e) => this.readFileContent(e, listelement);
      r.readAsBinaryString(listelement.file);
    } else {
      console.log('Failed to load file');
    }
  }

  readFileContent(e, listelement: MetaData) {
    const contents = (<IDBOpenDBRequest>e.target).result;

    listelement.filecontent = contents;
    console.log('Pushing: ', listelement);

    // rufe scan auf
    this.locdbService.saveScan(listelement.ppn,
                               listelement.firstpage.toString(), listelement.lastpage.toString(),
                               listelement.filecontent, listelement.file, listelement.resourceType).then(
                               (result) => console.log(result))
  }
}

class MetaData {
  ppn: string;
  firstpage: number;
  lastpage: number;
  file: File;
  filecontent: any;
  resourceType: string;
  allset: boolean;
}
