import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Citation } from './citation';
import { REFERENCES, REFERENCES_ALT } from './mock-references';
// import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { LocdbService } from './locdb.service';

const URL = '/api/'; // Same Origin Policy

@Component({
  moduleId: module.id,
  selector: 'scan',
  templateUrl: './scan.component.html',
  providers: [ LocdbService ]
})

export class ScanComponent {
  constructor ( private locdbService : LocdbService ) { }
  title = "File Upload";
  event: any;
  files: any;

  ppn: string;
  firstpage: number;
  lastpage: number;

  listoffiles: metadata[] = [];
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
        console.log('Files not ready!');
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
      if (this.listoffiles[this.active].ppn && this.listoffiles[this.active].firstpage && this.listoffiles[this.active].lastpage) {
         this.listoffiles[this.active].allset = true;
      }
    // } else {
      // console.log('FLUP: Invalid PPN or no firstpage or no lastpage set'); // throw error
    // }
  }
// <<<<<<< HEAD

//   writefilecontent(listelement: Metadata) {

//   if (listelement.file) {
//       console.log('FLUP: Trying to Read..');
//         const r = new FileReader();

//         r.onload = (e) => this.readFileContent(e, listelement);
//         r.readAsBinaryString(listelement.file);
//         console.log('FLUP: Done.');
//       } else {
//         console.log('FLUP: Failed to load file ' , listelement);
//       }
//   }

//   readFileContent(e, listelement: Metadata) {
//         const contents = (<IDBOpenDBRequest>e.target).result;

//         listelement.filecontent = contents;
//         console.log('FLUP: Starte upload..');

//         // rufe scan auf

//   }
//  }

// class Metadata {
// =======
// <<<<<<< HEAD

//   writefilecontent(listelement: Metadata) {

//   if (listelement.file) {
//       console.log('FLUP: Trying to Read..');
//         const r = new FileReader();

//         r.onload = (e) => this.readFileContent(e, listelement);
//         r.readAsBinaryString(listelement.file);
//         console.log('FLUP: Done.');
//       } else {
//         console.log('FLUP: Failed to load file ' , listelement);
//       }
//   }

//   readFileContent(e, listelement: Metadata) {
//         const contents = (<IDBOpenDBRequest>e.target).result;

//         listelement.filecontent = contents;
//         console.log('FLUP: Starte upload..');

//         // rufe scan auf

//   }
//  }

// class Metadata {
// =======
  
  
  
  //preview...
  

  // next(diff: number) {
  //   this.ref_idx = Math.abs((this.ref_idx + diff) % this.references.length);
  //   console.log('New current reference index', this.ref_idx);
  //   this.eventEmitter.next(this.references[this.ref_idx]);
    
  //   this.fil_idx = Math.abs((this.fil_idx + diff) % this.event.target.files.length);
  //   console.log('New current file index', this.fil_idx);
  //   this.readURL(this.event.target, this.fil_idx);
      
  // }
  
  readURL(input, i) {
        if (input.files && input.files[i]) {
            var reader = new FileReader();
            
            reader.onload = (e) => {
                console.log((<IDBOpenDBRequest>e.target).result);
                //this.src = (<IDBOpenDBRequest>e.target).result;
            }
            
            reader.readAsDataURL(input.files[i]);
        }
        else{
          console.log('files out of bounds');
        }
    }
    
  writefilecontent(listelement: metadata){

    if (listelement.file) {
      console.log("Trying to Read");
      var r = new FileReader();

      r.onload = (e) => this.readFileContent(e, listelement);
      r.readAsBinaryString(listelement.file);
    } else {
      console.log("Failed to load file");
    }
  }
  
  readFileContent(e, listelement: metadata){
    var contents = (<IDBOpenDBRequest>e.target).result;

    listelement.filecontent = contents;
    //console.log("listoffiles: " + this.listoffiles);
    console.log("Pushe: ", listelement);

    // rufe scan auf
    this.locdbService.saveScan(listelement.ppn,
      listelement.firstpage.toString(), listelement.lastpage.toString(),
      listelement.filecontent, listelement.file).subscribe((result) =>
        console.log(result)) }
}
  
class metadata{
  ppn: string;
  firstpage: number;
  lastpage: number;
  file: File;
  filecontent: any;
  ppnsucc: boolean;
  allset: boolean;
}
