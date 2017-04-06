import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Citation } from './citation';
import { REFERENCES, REFERENCES_ALT } from './mock-references';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

const URL ='/api/'; //Same Origin Policy

@Component({
  moduleId: module.id,
  selector: 'scan',
  templateUrl: './scan.component.html'
})

export class ScanComponent {
  public uploader: FileUploader = new FileUploader({url: URL});
  event: any;
  files: any;
  selected: number;
  
  ppn = '1234567';
  firstpage = 2;
  lastpage = 12;
  
  listoffiles: metadata[] = [];
  listoffilescontents = [];
  
  active: number;
  fileIsActive: boolean = false;
  isActive: boolean = false;
  
  references: Citation[][] = [REFERENCES, REFERENCES_ALT, []];
  ref_idx: number;
  fil_idx: number;
  @Output() eventEmitter: EventEmitter<Citation[]> = new EventEmitter();

  toggle() {
    this.isActive = !this.isActive
  }
  
  onclickupload(){ // check if content is set
    let ready = true;
    if(this.listoffiles != []){ // or !== ?
      let file
      for(file of this.listoffiles){
        if(!file.allset)
          ready = false;
      }
    }
    console.log("UploadReady? "+ready)
    if(ready){
      //this.src = 'click'
      console.log("start upload..");
      
      this.listoffiles.map((elem) => this.writefilecontent(elem));
      
    }
  }

  onclickclear(){
    console.log("Is uploading: ", this.uploader.isUploading);
    if(this.uploader.isUploading){
    }
    else {
      this.files = '';
      this.uploader.clearQueue();
      this.listoffiles = [];
    }
  }
  
  onChange(event: any) { // file input
    this.files = '';
    this.files = event.target.files;//this.uploader.queue;
    console.log("event target results: " + (<IDBOpenDBRequest>event.target).result);
    console.log(this.files);
    console.log(this.files[0]);
    let file: any;
    let filenumber = 0;
    for(file of this.files){
      console.log(file);
      let ppnt = this.getidfromstring(file.name);
      
      if(ppnt === "")
        this.listoffiles.push({ ppn: null, firstpage: null, lastpage: null, file: file, filecontent : null, ppnsucc: false, allset: false});
      else 
        this.listoffiles.push({ ppn: ppnt, firstpage: null, lastpage: null, file: file, filecontent : null, ppnsucc: true, allset: false});
    
      console.log(this.listoffiles);
     
      filenumber+=1;
      
    console.log(this.listoffiles[this.listoffiles.length-1].filecontent);
    }
    //this.uploader.queue[0].file
    
    
    this.ref_idx = 0;
    this.fil_idx = 0;
    this.eventEmitter.next(this.references[this.ref_idx]);
  }

  onSelectFile(i: number){
    if(this.files)
      this.fileIsActive = true;
    
    this.active = i;
    
    if(this.listoffiles[i].ppnsucc){
      this.ppn = this.listoffiles[i].ppn;
      this.firstpage = this.listoffiles[i].firstpage;
      this.lastpage = this.listoffiles[i].lastpage;
        }
      }
  
  
  getidfromstring(f: any){
    let name = f;
    // do same magic
    //let re = /(?:\.([^.]+))?$/;
    let re = /([0-9]{7})/;
    let id
    try {
      id = re.exec(name)[0]; 
    }
    catch(err) {
      console.log("RegEx not found; " + err);
      id = ''
    }
    // some more maybe?
    return id
  }
    
  
  onclicksaveentries(){
    if(!(this.getidfromstring(this.ppn)==="") && this.firstpage && this.lastpage) // check if number
      {
      this.fileIsActive = false;
      this.listoffiles[this.active].ppn = this.ppn ;
      this.listoffiles[this.active].firstpage = this.firstpage;
      this.listoffiles[this.active].lastpage = this.lastpage;
      if(this.listoffiles[this.active].ppn && this.listoffiles[this.active].firstpage && this.listoffiles[this.active].lastpage)
         this.listoffiles[this.active].allset = true;
    }
    else{
      console.log("Invalid PPN or no firstpage or no lastpage set"); // throw error
    }
  }
  
  
  
  //preview...
  

  next(diff: number) {
    this.ref_idx = Math.abs((this.ref_idx + diff) % this.references.length);
    console.log('New current reference index', this.ref_idx);
    this.eventEmitter.next(this.references[this.ref_idx]);
    
    this.fil_idx = Math.abs((this.fil_idx + diff) % this.event.target.files.length);
    console.log('New current file index', this.fil_idx);
    this.readURL(this.event.target, this.fil_idx);
      
  }
  
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
        
  }
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
