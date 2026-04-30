import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-no-record-found',
  templateUrl: './no-record-found.component.html',
  styleUrls: ['./no-record-found.component.scss']
})
export class NoRecordFoundComponent {
  @Input() message: string = 'No records found matching your criteria.';
  @Input() subMessage: string = 'Try adjusting your filters or search terms.';
  @Input() icon: string = 'search_off'; // Material icon name
  @Input() showButton: boolean = false;
  @Input() buttonText: string = 'Refresh Data';
  
  @Output() actionClicked = new EventEmitter<void>();

  onAction() {
    this.actionClicked.emit();
  }
}