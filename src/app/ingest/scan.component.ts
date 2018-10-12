import { Component, Input, Output, EventEmitter} from '@angular/core';
// import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LocdbService } from '../locdb.service';
import { FeedComponent, FeedReaderComponent } from './feed-reader/feed-reader.component';

import { enums, enum_values, models } from '../locdb';

import { REQUIRED_IDENTIFIERS, requiresPageNumbers } from './constraints';

@Component({
  // moduleId: module.id,
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css'],
  providers: [ LocdbService ]
})

export class ScanComponent {
  title = 'Ingest';

  selected: ToDoScansWithMeta;

  // just to make them accessible
  requiredIdentifiers = REQUIRED_IDENTIFIERS;
  requiresPageNumbers = requiresPageNumbers;

  resourceTypes: string[] = Object.keys(REQUIRED_IDENTIFIERS);
  // resourceTypes = enums.resourceType;

  embodimentTypes: string[] = enum_values(enums.embodimentType);

  identifierTypes: string[] = enum_values(enums.identifier);

  uploading = false; // just for disabling the button

  listoffiles: ToDoScansWithMeta[] = [];
  batch: File[] = [];

  batchInformation: {
    resourceType: enums.resourceType,
    identifierScheme: enums.identifier
  } = { resourceType: enums.resourceType.bookChapter, identifierScheme:
  enums.identifier.swb_ppn }
  // DEFAULTS FOR batch process

  modalRef: BsModalRef;

  constructor ( private locdbService: LocdbService, private modalService: BsModalService) {
    // necessary to display select options
  }

  preselectBatchIdentifierScheme() {
    // Function to pre-select an identifier scheme of the batch, depending on batch resource type
    this.batchInformation.identifierScheme = REQUIRED_IDENTIFIERS[this.batchInformation.resourceType][0];
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onclickupload() { // check if content is set
    // if (this.fileIsActive) {
    //   this.saveentries();
    // }
    this.onSelect(null) // to check open file
    let ready = true;
    if (this.listoffiles !== []) {
      for (const file of this.listoffiles) {
        if (!file.allset) {
          ready = false;
          break;
        }
      }
    }
    if (ready) {
      console.log('Ready for upload...');
      this.uploading = true;
      this.listoffiles.map((elem) => this.writefilecontent(elem));
    } else {
      alert('Please insert missing information!');
    }
  }

  onclickclear() {
    // file lists
    this.listoffiles = [];
  }

  onChange(event: any) { // file input
    console.log(event);
    this.batch = event.target.files;
  }

  confirmBatch() {
    for (const file of this.batch) {
      const [_id, first, last] = this.extractidandPages(file.name);
      const rtype = this.batchInformation.resourceType;
      const identifierScheme = this.batchInformation.identifierScheme;
      this.listoffiles.push(
        new ToDoScansWithMeta(
          {
            identifier: { literalValue: _id, scheme: identifierScheme},
            firstpage: first,
            lastpage: last,
            file: file,
            resourceType: rtype, uploading: false,
            textualPdf: false,
            embodimentType: enums.embodimentType.print
          }
        )
      );
    }
    this.modalRef.hide();
  }

  onSelect(item: ToDoScansWithMeta) {
    if (item === this.selected) {
      this.selected = null; // closes the 'drop-down'
    } else {
      this.selected = item;
    }
  }

  extractDOI(name: string): string | null {
    // TODO FIXME
    // Here the forward slash between \d{4,9} and the remainder is missing, because of filename restrictions
    const doi_re = /10\.\d{4,9}[-._;()/:A-Z0-9]+/i;
    const match = doi_re.exec(name);
    // warning match[0] is the full match
    console.log('DOI regexp yields following matches:', match, 'on filename', name);
    return match ? match[0] : null;
  }

  extractPPN(name: string): [string, string] | [null, string] {
    const ppn_re = /^([0-9]{8}[0-9X])(.*)/i;
    const match = ppn_re.exec(name);
    console.log('PPN regexp yields following matches:', match, 'on filename', name);
    if (match) {
      return [match[1], match[2]];
    } else {
      return [null, name]
    }
  }


  extractidandPages(name: string): [string, number, number] {
    // chomp file extension
    name = name.substring(0, name.lastIndexOf('.'));
    const [ppn, remainder] = this.extractPPN(name);
    let first: number = null;
    let last: number = null;
    if (ppn) {
      // PPN Found
      // now be greedy and try to extract page numbers
      console.log('Extracting pages from remainder', remainder)
      const pages_re = /([1-9][0-9]*)[-_.+]([1-9][0-9]*)/;
      const match = pages_re.exec(remainder);
      console.log(match)
      if (match) {
        first = Number(match[1]) || null;
        last = Number(match[2]) || null;
      } else {
        const spage_re = /[1-9][0-9]+/;
        console.log('Extracting single page from remainder', remainder)
        const spage_match = spage_re.exec(remainder);
        console.log(spage_match)
        first = last = Number(spage_match) || null;
      }
      return [ppn, first, last];
    } else {
      // Try to extract DOI
      const doi = this.extractDOI(name);
      return [doi, null, null];
    }

    // return [_id, first, last];


    // // do some magic
    // const ppn_re = /([0-9]{8}[0-9X])([-_.+]0*([1-9][0-9]+)([-_.+]0*([1-9][0-9]+))?)?/;
    // let _id = null, first = null, last = null;
    // try {
    //   const match = ppn_re.exec(name);
    //   console.log('PPN RE matches', match)
    //   _id = match[1];
    //   // 2 ..
    //   first = Number(match[3]) || null;
    //   // and 4 are grouped to make them optional
    //   last = Number(match[5]) || null;
    // } catch (err) { console.log('No PPN found, trying to extract DOI'); }
    // if (first && !last) {
    //   last = first;
    // }
    // if (!_id) {
    //   // The DOI case
    //   // currently without page numbers
    //   _id = this.extractDOI(name);
    // }

    // console.log('extracted:', _id, first, last)
    // // some more maybe?
    // return [_id, first, last];
  }

  // nicht mehr als onclick genutzt
  // oh yes it is called by onclickupload and onSelectFile
  // saveentries() {
  //   console.log('idtype saveentries ' + this.identifier.scheme)
  //   this.fileIsActive = false;
  //   this.active.firstpage = this.firstpage;
  //   this.active.lastpage = this.lastpage;
  //   this.active.identifier = new Identifier(this.identifier); // true copy
  //   this.active.resourceType = this.resourceType;
  //   this.active.textualPdf = this.textualPdf;
  //   // can we do this check elsewhere? it is only triggered when the file is collapsed
  //   this.active.allset = this.isValid(this.identifier.literalValue, this.resourceType, this.firstpage, this.lastpage);
  // }

  // readURL(input, i) {
  //   if (input.files && input.files[i]) {
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       console.log((<IDBOpenDBRequest>e.target).result);
  //       // this.src = (<IDBOpenDBRequest>e.target).result;
  //     }

  //     reader.readAsDataURL(input.files[i]);
  //   } else {
  //     console.log('files out of bounds');
  //   }
  // }


  writefilecontent(listelement: ToDoScansWithMeta) {
    // flag idonly objects, accept them but do not read them
    console.log(this.listoffiles.indexOf(listelement))
    console.log(listelement.file)
    listelement.uploading = true;
    listelement.err = null;
    if (listelement.file) {
      // NOTE: if-else is redundant, maybe need to catch some inputs here
      // it is obviously enough to just provide the file metadata
      // as formdata push will then load the file on server side
      // do not test it before workshop
      // -- after ws
      // the contents are not needed for submission!!!!
      // console.log('Trying to Read');
      // const r = new FileReader();
      // r.onload = (e) => this.readFileContent(e, listelement);
      // r.readAsBinaryString(listelement.file);
      console.log('Uploading file');
      this.uploadFile(listelement);
    } else {
      // saveElectronicJournal should go here
      console.log('Empty file. Uploading as Journal');
      this.locdbService.saveResource(listelement.identifier.scheme,
      listelement.identifier.literalValue,
      listelement.resourceType).subscribe(
        (suc) => this.successHandler(listelement, suc, false),
        (err) => this.processError(listelement, err)
      ) // is it set?
    }
  }

  uploadFile(listelement: ToDoScansWithMeta) {
    // const contents = (<IDBOpenDBRequest>e.target).result;

    // listelement.filecontent = contents;
    console.log('Pushing: ', listelement);
    // turn third arguments to true to enable auto-trigger
    // depends on back-end returning the correct scan
      // Monograph no page numbers necessary
      this.locdbService.saveResource(listelement.identifier.scheme,
      listelement.identifier.literalValue,
      listelement.resourceType,
      listelement.firstpage || undefined,
      listelement.lastpage || undefined,
      listelement.textualPdf,
      listelement.file,
      '',
      listelement.embodimentType
    ).subscribe(
      (suc) => this.successHandler(listelement, suc, true),
      (err) => this.processError(listelement, err)
    );
    // print or digital enum)
    //
    //   this.locdbService.saveScan(
    //     listelement.identifier.literalValue,
    //     listelement.resourceType,
    //     listelement.textualPdf,
    //     listelement.file,
    //   ).subscribe(
    //     (suc) => this.successHandler(listelement, suc, true), // auto trigger ocr
    //     (err) => this.processError(listelement, err)
    //   );
    // } else if (listelement.resourceType === enums.resourceType.journal) {
    //   // Electronic journal.
    //   this.locdbService.saveScanForElectronicJournal (
    //     listelement.identifier.scheme,
    //     listelement.identifier.literalValue,
    //     listelement.textualPdf,
    //     listelement.file
    //   ).subscribe(
    //     (suc) => this.successHandler(listelement, suc, false),
    //     (err) => this.processError(listelement, err)
    //   );
    // } else { // Collection
    //   this.locdbService.saveScan(
    //     listelement.identifier.literalValue,
    //     listelement.resourceType,
    //     listelement.textualPdf,
    //     listelement.file,
    //     listelement.firstpage.toString(), // toString for transport
    //     listelement.lastpage.toString() // toString for transport
    //   ).subscribe(
    //     (suc) => this.successHandler(listelement, suc, true), // auto trigger ocr
    //     (err) => this.processError(listelement, err)
    //   );

  }

  successHandler(item, response, autotrigger: boolean) {
    item.uploading = false;
    console.log(response);
    // last element is scan
    const entry: models.BibliographicEntry = response[response.length - 1];
    console.log('Response item: ', response)
    // clear after upload
    this.removeItemFromList(item);
    this.checkUploading(); // check if there is any element still uploading

    // direct trigger OCR processing
    if (autotrigger) {
      console.log('Auto-triggering ocr processing for', entry);
      this.locdbService.triggerOcrProcessing(entry._id).subscribe(
        (res) => console.log('Successfully processed scan', entry),
        (err) => console.log('Error in auto OCR processing', err.message),
      );
    }
  }

  removeItemFromList(item: ToDoScansWithMeta) {
    // used by button and successhandler
    const index = this.listoffiles.indexOf(item)
    if (index !== -1) {
      this.listoffiles.splice(index, 1);
    }
  }

  processError(elem: ToDoScansWithMeta, err: any) {
    elem.uploading = false;
    elem.err = err; // first assigned this property
    this.checkUploading();
    console.log('Send Scans failed: ', elem, err)
  }

  addId() {
    this.listoffiles.push(new ToDoScansWithMeta(
      {
        identifier: { scheme: enums.identifier.doi, literalValue: '' },
        firstpage: null,
        lastpage: null,
        file: null,
        resourceType: enums.resourceType.journalArticle,
        embodimentType: enums.embodimentType.digital,
        uploading: false
      })
    );
    console.log('added empty to listoffiles: ', this.listoffiles)
  }

    /* the two method below could go to the class */
  getName(item: ToDoScansWithMeta) {
    if (item.file) {
      return item.file.name;
    } else if (item.identifier == null) {
      return 'Electronic Resource';
    } else {
      return item.identifier.scheme + ': ' + item.identifier.literalValue;
    }
  }

  getMetadata(item: ToDoScansWithMeta) {
    if (item.file) {
      return (item.file.size / 1024 / 1024).toFixed(3) + ' MB, '
        + item.file.type;
    } else {
      return 'Electronic';
    }
  }

  checkUploading() {
    // disable button as long as at least one is still being uploaded
    if (this.listoffiles.length === 0) {
      this.uploading = true;
    }
    console.log(this.listoffiles.map((elem) => elem.uploading));
    this.uploading = !this.listoffiles.every((elem) => !elem.uploading);
  }
}

class ToDoScansWithMeta {
  identifier: models.Identifier;
  firstpage?: number;
  lastpage?: number;
  file?: File;
  uploading: boolean; // to determine button state
  err?: any;
  textualPdf?: boolean; // textual pdf flag. optional since not needed for electronic
  embodimentType?: enums.embodimentType;

  // private, to overwrite setter side effects
  private _resourceType;
  set resourceType( newType: string) {
    // side effect: valid identifier types may not match
    // let oldScheme = this.identifier.scheme;
    // if (REQUIRED_IDENTIFIERS[newType].indexOf(oldScheme) === -1) {
      // identifier scheme not possible for new type, guess one
    this.identifier.scheme = REQUIRED_IDENTIFIERS[newType][0];
    // }
    this._resourceType = newType;
  }

  get resourceType (): string {
    return this._resourceType;
  }


  constructor (other: Partial<ToDoScansWithMeta>) {
    Object.assign(this, other);
  }

  get allset() {
    const idOk = ((REQUIRED_IDENTIFIERS[this.resourceType].indexOf(this.identifier.scheme) > -1) && this.identifier.literalValue);
    if (idOk) {
      if (this.file && requiresPageNumbers(this.resourceType, this.identifier.scheme)) {
        // non-null and non-zero, could also check whether first <= last but ok
        return (this.firstpage && this.lastpage);
      } else {
        return true;
      }
    }
    // else it has an identifier
    // if (this.resourceType === enums.resourceType.monograph || this.resourceType === enums.resourceType.journal) {
    //   return true;
    // } else {
    //   // currently only collection requires pages numbers
    //   if (this.firstpage && this.lastpage) {
    //     return true;
    //   }
    // }
    // default
    return false;
  }
}
