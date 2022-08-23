import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { LineOfBusiness } from './LineOfBusiness';
import { LineOfBusinessService } from './lineOfBusiness.service';
import { RecentQuotes } from './RecentQuotes';
import { RecentQuotesService } from './recentQuotes.service';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Agency Authority - Insurance Coverages Allowed to be Rated';
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotes: RecentQuotes[] = [];
  popular1: string = '';
  popular1Percent: number = 0.0;
  popular2: string = '';
  popular2Percent: number = 0.0;
  
  constructor(
    private lineOfBusinessService: LineOfBusinessService,
    private recentQuotesService: RecentQuotesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getPopularLinesOfBusiness();
  }

  getQuotesTotal(lineOfBusiness: LineOfBusiness): number {
    return this.recentQuotes.filter(quote => quote.lineOfBusiness === lineOfBusiness.id).length;
  }

  getPopularLinesOfBusiness(): void {
    this.recentQuotesService.getRecentQuotes().subscribe(
      recentQuotes => this.recentQuotes = recentQuotes,
      () => this.messageService.add("Failed to retrieve recent quotes."));
    this.lineOfBusinessService.getLinesOfBusiness()
      .subscribe(linesOfBusiness => {
        this.linesOfBusiness = linesOfBusiness.sort((a,b) => this.getQuotesTotal(b)-this.getQuotesTotal(a));
        this.popular1 = this.linesOfBusiness[0].name;
        this.popular1Percent = 100*(this.getQuotesTotal(this.linesOfBusiness[0])/this.recentQuotes.length);
        this.popular2 = this.linesOfBusiness[1].name;
        this.popular2Percent = 100*(this.getQuotesTotal(this.linesOfBusiness[1])/this.recentQuotes.length);
      }
    );
  }
}
