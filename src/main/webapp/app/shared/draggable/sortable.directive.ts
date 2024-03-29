import { Directive, forwardRef, HostBinding } from '@angular/core';
import { DraggableDirective } from './draggable.directive';

@Directive({
  selector: '[jhiSortable]',
  providers: [
    { provide: DraggableDirective, useExisting: forwardRef(() => SortableDirective) }
  ]
})
export class SortableDirective extends DraggableDirective {
  @HostBinding('class.sortable') sortable = true;
}
