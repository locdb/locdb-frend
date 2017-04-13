import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Citation } from './citation';
import { REFERENCES, REFERENCES_ALT } from './mock-references';
// import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

const URL = '/api/'; // Same Origin Policy

@Component({
  moduleId: module.id,
  selector: 'scan',
  templateUrl: './scan.component.html'
})

export class ScanComponent {
  files: any;

  ppn = '1234567';
  firstpage = 2;
  lastpage = 12;

  listoffiles: Metadata[] = [];
  listoffilescontents = [];

  active: number;
  fileIsActive = false;
  isActive = false;
  activefile = 0;

  toggle() {
    this.isActive = !this.isActive;
  }

  togglefile() {
    this.fileIsActive = !this.fileIsActive;
  }

  onclickupload() { // check if content is set
    let ready = true;
    if (this.listoffiles !== []) { // or !== ?
      for (const file of this.listoffiles){
        if (!file.allset) {
          ready = false;
        }
      }
    }
    if (ready) {
      console.log('FLUP: Ready for upload..');
      this.listoffiles.map((elem) => this.writefilecontent(elem));

    } else {
        console.log('FLUP: Files not ready!');
        }
  }

  onclickclear() {
    this.files = '';
    this.listoffiles = [];

  }

  onChange(event: any) { // file input
    this.files = '';
    this.files = event.target.files; // this.uploader.queue;
    let file: any;
    let filenumber = 0;
    for (file of this.files){
      const ppnt = this.getidfromstring(file.name);
      if (ppnt === '') {
        this.listoffiles.push({ ppn: null, firstpage: null, lastpage: null, file: file, filecontent : null, ppnsucc: false, allset: false});
      } else {
        this.listoffiles.push({ ppn: ppnt, firstpage: null, lastpage: null, file: file, filecontent : null, ppnsucc: true, allset: false});
      }

      filenumber += 1;

    }
  }

  onSelectFile(i: number) {
    if (i === this.active || !this.fileIsActive) {
      this.togglefile();
      }

    this.active = i;

    if (this.listoffiles[i].ppnsucc) {
      this.ppn = this.listoffiles[i].ppn;
      this.firstpage = this.listoffiles[i].firstpage;
      this.lastpage = this.listoffiles[i].lastpage;
        }
      }


  getidfromstring(name: any) {
    // do same magic
    // let re = /(?:\.([^.]+))?$/;
    const re = /([0-9]{7})/;
    let id;
    try {
      id = re.exec(name)[0];
    } catch (err) {
      console.log('FLUP: RegEx not found; '); // + err);
      id = '';
    }
    // some more maybe?
    return id;
  }

  onclicksaveentries() {
    if (!(this.getidfromstring(this.ppn) === '') && this.firstpage && this.lastpage) {  // check if number
      this.fileIsActive = false;
      this.listoffiles[this.active].ppn = this.ppn ;
      this.listoffiles[this.active].firstpage = this.firstpage;
      this.listoffiles[this.active].lastpage = this.lastpage;
      if (this.listoffiles[this.active].ppn && this.listoffiles[this.active].firstpage && this.listoffiles[this.active].lastpage) {
         this.listoffiles[this.active].allset = true;
      }
    } else {
      console.log('FLUP: Invalid PPN or no firstpage or no lastpage set'); // throw error
    }
  }

  writefilecontent(listelement: Metadata) {

  if (listelement.file) {
      console.log('FLUP: Trying to Read..');
        const r = new FileReader();

        r.onload = (e) => this.readFileContent(e, listelement);
        r.readAsBinaryString(listelement.file);
        console.log('FLUP: Done.');
      } else {
        console.log('FLUP: Failed to load file ' , listelement);
      }
  }

  readFileContent(e, listelement: Metadata) {
        const contents = (<IDBOpenDBRequest>e.target).result;

        listelement.filecontent = contents;
        console.log('FLUP: Starte upload..');

        // rufe scan auf

  }
 }

class Metadata {
ppn: string;
firstpage: number;
lastpage: number;
file: File;
filecontent: any;
ppnsucc: boolean;
allset: boolean;
}
