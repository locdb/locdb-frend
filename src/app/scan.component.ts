import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Citation } from './citation';
import { REFERENCES, REFERENCES_ALT } from './mock-references';
// import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { LocdbService } from './locdb.service';

import { RESOURCE_TYPES } from './locdb';

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

  id: string;
  idtype: string;
  firstpage: number;
  lastpage: number;
  resourceType = 'MONOGRAPH'; // needs to be value of select block

  resourceTypes = RESOURCE_TYPES;

  listoffiles: MetaData[] = [];
  // unused?
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
    } else {
      alert('Files not ready!');
    }
  }

  onclickclear() {
    // file lists
    this.files = '';
    this.listoffiles = [];

    // active files
    this.active = null;
    this.fileIsActive = false;
    this.isActive = false;
    this.activefile = 0;

    // current data
    this.id = null;
    this.firstpage = null;
    this.lastpage = null;
    this.resourceType = 'MONOGRAPH'; // needs to be value of select block
  }

  onChange(event: any) { // file input
    this.files = '';
    this.files = event.target.files; // this.uploader.queue;
    let file: any;
    for (file of this.files){
      const [id, first, last] = this.extractidandPages(file.name);
      let rtype = 'MONOGRAPH';
      if (first && last) {
        rtype = 'COLLECTION';
        console.log('Assuming a collection')
      } else {
        console.log('Assuming a monograph')
      }
      this.listoffiles.push(
        { id: id, idtype: null, firstpage: first, lastpage: last, file: file, filecontent
          : null, allset: this.isValid(id, rtype, first, last), resourceType: rtype}
      );
    }
  }

  isValid(id: string, rtype: string, first: number, last: number): boolean {
    if (!id) {
      return false;
    }
    if (rtype === 'MONOGRAPH') {
      return true;
    } else {
      if (first && last) {
        return true;
      }
    }
    // default
    return false;
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

    this.id = this.listoffiles[i].id;
    this.firstpage = this.listoffiles[i].firstpage;
    this.lastpage = this.listoffiles[i].lastpage;
    this.resourceType = this.listoffiles[i].resourceType;
  }


  extractidandPages(name: any) {
    // do same magic
    // let re = /(?:\.([^.]+))?$/;
    const re = /([0-9]{8}[0-9X])([-_.+]0*([1-9][0-9]+)([-_.+]0*([1-9][0-9]+))?)?/;
    console.log('extracting id and pages from filename');
    let id = null, first = null, last = null;
    try {
      const match = re.exec(name)
      console.log(match)
      id = match[1];
      // 2 ..
      first = match[3];
      // and 4 are grouped to make them optional
      last = match[5];
    } catch (err) { console.log('No id found in filename'); }
    // could pick last number of id as we did not remove it
    // const pages_re = /([1-9][0-9]+)[-_+]([1-9][0-9]+)/;
    if (first && !last) {
      last = first;
    }
    console.log('extracted:', id, first, last)

    // some more maybe?
    return [id, first, last];
  }

  // nicht mehr als onclick genutzt
  // oh yes it is called by onSelectFile
  saveentries() {
    this.fileIsActive = false;
    this.listoffiles[this.active].id = this.id ;
    this.listoffiles[this.active].firstpage = this.firstpage;
    this.listoffiles[this.active].lastpage = this.lastpage;
    this.listoffiles[this.active].resourceType = this.resourceType;
    // can we do this check elsewhere? it is only triggered when the file is collapsed
    this.listoffiles[this.active].allset = this.isValid(this.id, this.resourceType, this.firstpage, this.lastpage);
    // if (this.listoffiles[this.active].id && this.listoffiles[this.active].resourceType) {
    //   if (this.listoffiles[this.active].resourceType === 'MONOGRAPH') {
    //     // hard coded enum value TODO FIXME (long-term)
    //     //
    //     this.listoffiles[this.active].allset = true;

    //   } else if (this.listoffiles[this.active].firstpage && this.listoffiles[this.active].lastpage) {
    //       this.listoffiles[this.active].allset = true;
    //   } else {
    //     this.listoffiles[this.active].allset = false;
    //   }
    // } else {
    //   this.listoffiles[this.active].allset = false;
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

    if (listelement.resourceType === 'MONOGRAPH') {
      this.locdbService.saveScan(
        listelement.id,
        listelement.resourceType,
        listelement.file,
        listelement.filecontent,
      ).then((suc) => this.removeItemFromList(suc))
       .catch((err) => this.processError(err));
    } else {
      this.locdbService.saveScan(
        listelement.id,
        listelement.resourceType,
        listelement.file,
        listelement.filecontent,
        listelement.firstpage.toString(),
        listelement.lastpage.toString()
      ).then((suc) => this.removeItemFromList(suc))
       .catch((err) => this.processError(err));
    }

    // rufe scan auf
  }

  removeItemFromList(item) {
    console.log('Send item: ', item)
    // clear after upload
    this.onclickclear(); // TODO remove items not at once
  }
  processError(err) {
    console.log('Send Scans failed: ', err)
    // set item error
  }
  addId(){
    this.listoffiles.push(
      { id: null, idtype: null, firstpage: null, lastpage: null, file: null, filecontent
        : null, allset: false, resourceType: 'MONOGRAPH'}
    );
    console.log("added emtpy to listoffiles: ", this.listoffiles)
  }

}

interface MetaData {
  id: string;
  idtype: string;
  firstpage?: number;
  lastpage?: number;
  file?: File;
  filecontent?: any;
  resourceType?: string; //maybe requiered?
  allset?: boolean; //maybe save to assume?
}
