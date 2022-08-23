import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { RecentQuotes } from '../RecentQuotes';
import { RecentQuotesService } from '../recentQuotes.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html',
  styleUrls: [ './lineOfBusiness-detail.component.css' ]
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;
  quotesTotal: number = 0;
  lineOfBusinessId: number = 0;
  recentQuotes: RecentQuotes[] = [];

  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private recentQuotesService: RecentQuotesService,
    private messageService: MessageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getLineOfBusiness();
    this.getQuotesTotal();
  }

  getLineOfBusiness(): void {
    this.lineOfBusinessId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.lineOfBusinessService.getLineOfBusiness(this.lineOfBusinessId)
      .subscribe(lineOfBusiness => this.lineOfBusiness = lineOfBusiness);
  }

  getQuotesTotal(): void {
    this.recentQuotesService.getRecentQuotes().subscribe(
      recentQuotes => this.recentQuotes = recentQuotes,
      () => this.messageService.add("Failed to retrieve recent quotes."),
      () => this.quotesTotal = this.recentQuotes.filter(
        quote => quote.lineOfBusiness === this.lineOfBusinessId
        ).length
    );
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => this.goBack());
    }
  }
}
