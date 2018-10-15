import { Component, OnInit } from '@angular/core';

import { UtilsService } from '../typescript-angular-client/api/utils.service'

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {

  stats: string;

  constructor(private utilsService: UtilsService) { }

  ngOnInit() {
    this.utilsService.stats().subscribe(
      (stats) => { this.stats = stats }
      (error) => { this.stats = error.message }
    );
  }

}
