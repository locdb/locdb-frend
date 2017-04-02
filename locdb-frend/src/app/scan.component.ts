import { Component, Output, EventEmitter} from '@angular/core';
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
  public uploader:FileUploader = new FileUploader({url: URL});
  event: any;
  files: any;
  src = '';
  
  references: Citation[][] = [REFERENCES, REFERENCES_ALT, []];
  ref_idx: number;
  fil_idx: number;
  @Output() eventEmitter: EventEmitter<Citation[]> = new EventEmitter();
  
  onclickupload(){
    //this.src = 'click'
    console.log("start upload..");
    this.uploader.uploadAll();
    console.log("Is uploading: ", this.uploader.isUploading);
  }
  
  onclickclear(){
    console.log("Is uploading: ", this.uploader.isUploading);
    if(this.uploader.isUploading){
    }
    else {
      this.files = '';
      this.uploader.clearQueue();
    }
  }
  
  onChange(event: any) {
    this.files = '';
    //this.src = event 
    console.log("onChange");
    console.log(event.target);
    
    //this.event = event;
    this.files = this.uploader.queue;
    console.log(this.files);
    console.log(this.uploader);
    console.log(this.uploader.queue);
    //this.readURL(this.uploader.queue, 0);
    this.uploader.queue[0].file
    //this.src = this.uploader.queue[0].file.fakePathOrObject;
    //console.log('[ScanComponent] onChange(event) called with files:', files);
    
    this.ref_idx = 0;
    this.fil_idx = 0;
    this.eventEmitter.next(this.references[this.ref_idx]);
  }

  getidfromfile(f: any){
    return f.name.split(".")[0]
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
                this.src = (<IDBOpenDBRequest>e.target).result;
            }
            
            reader.readAsDataURL(input.files[i]);
        }
        else{
          console.log('files out of bounds');
        }
    }
  
}
