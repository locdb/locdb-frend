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
    let file: any;
    let filenumber = 0;
    for (file of this.files){
      const ppnt = this.getidfromstring(file.name);
      if (ppnt === '') {
        this.listoffiles.push(
          { ppn: null, firstpage: null, lastpage: null, file: file, filecontent
            : null, ppnsucc: false, allset: false, resourceType: null}
        );
      } else {
        this.listoffiles.push(
          { ppn: ppnt, firstpage: null, lastpage: null, file: file, filecontent
            : null, ppnsucc: true, allset: false, resourceType: null}
        );
      }

      filenumber += 1;

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

  // nicht mehr als onclick genutzt
  saveentries() {
    // if (!(this.getidfromstring(this.ppn) === '') && this.firstpage && this.lastpage) {  // check if number
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
      listelement.filecontent, listelement.file, listelement.resourceType).subscribe(
      (result) => console.log(result),
      (error) => console.log(error)
      ) }
}

class MetaData {
  ppn: string;
  firstpage: number;
  lastpage: number;
  file: File;
  filecontent: any;
  resourceType: string;
  ppnsucc: boolean;
  allset: boolean;
}
