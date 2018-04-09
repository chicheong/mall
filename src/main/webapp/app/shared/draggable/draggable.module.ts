import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { DraggableDirective } from './draggable.directive';
import { DraggableRxDirective } from './draggable-rx.directive';
import { MovableDirective } from './movable.directive';
import { MovableAreaDirective } from './movable-area.directive';
import { DraggableHelperDirective } from './draggable-helper.directive';
import { SortableDirective } from './sortable.directive';
import { SortableListDirective } from './sortable-list.directive';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule
  ],
  declarations: [
    DraggableDirective,
    DraggableRxDirective,
    MovableDirective,
    MovableAreaDirective,
    DraggableHelperDirective,
    SortableDirective,
    SortableListDirective
  ],
  exports: [
    DraggableDirective,
    DraggableRxDirective,
    MovableDirective,
    MovableAreaDirective,
    DraggableHelperDirective,
    SortableListDirective,
    SortableDirective
  ]
})
export class DraggableModule { }
