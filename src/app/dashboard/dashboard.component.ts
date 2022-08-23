import { Component, OnInit } from '@angular/core';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RecentQuotes } from '../RecentQuotes';
import { RecentQuotesService } from '../recentQuotes.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotes: RecentQuotes[] = [];

  constructor(
    private lineOfBusinessService: LineOfBusinessService,
    private recentQuotesService: RecentQuotesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getLinesOfBusiness();
  }

  getQuotesTotal(lineOfBusiness: LineOfBusiness): number {
    return this.recentQuotes.filter(quote => quote.lineOfBusiness === lineOfBusiness.id).length;
  }

  getLinesOfBusiness(): void {
    this.recentQuotesService.getRecentQuotes().subscribe(
      recentQuotes => this.recentQuotes = recentQuotes,
      () => this.messageService.add("Failed to retrieve recent quotes."))
    this.lineOfBusinessService.getLinesOfBusiness()
      .subscribe(linesOfBusiness => this.linesOfBusiness = 
        linesOfBusiness.sort((a,b) => this.getQuotesTotal(b)-this.getQuotesTotal(a)).slice(0,3));
  }
}
