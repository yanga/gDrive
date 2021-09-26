import {Component, OnInit} from '@angular/core';
import {DataService} from '../../service/data.service';
import {DataFilters} from '../../models/filters.model';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit {
  like = false;
  comment = false;
  rates = Array(5).fill(0);
  operators = ['<', '=', '>'];
  ratingOperator = '=';
  rating = 0;
  filters: DataFilters | null = null;
  hasFiltersActive = false;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.filters.subscribe(filters => {
      this.filters = filters;
      this.rating = filters.rating.value;
      this.like = filters.like.value;

      this.hasFiltersActive = filters.rating.active || filters.like.active;
    });
  }

  toggleLike(): void {
    this.like = !this.like;
    this.dataService.setLikeFilter(this.like);
  }

  toggleComment(): void {
    this.comment = !this.comment;
    this.dataService.setCommentFilter(this.comment);
  }

  setRating(rate: number): void {
    if (this.rating === rate + 1) {
      this.rating = -1;
    } else {
      this.rating = rate + 1;
    }
    this.dataService.setRatingFilter(this.rating);
  }

  setRatingOperator(op: string) {
    this.dataService.setRatingOperator(op);
  }

  clearFilters(): void {
    this.dataService.clearAllFilters();
  }
}
