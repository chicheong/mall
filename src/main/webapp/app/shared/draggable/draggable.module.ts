import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './draggable.directive';
import { DraggableRxDirective } from './draggable-rx.directive';
import { MovableDirective } from './movable.directive';
import { MovableAreaDirective } from './movable-area.directive';
import { DraggableHelperDirective } from './draggable-helper.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DraggableDirective, DraggableRxDirective, MovableDirective, MovableAreaDirective, DraggableHelperDirective],
  exports: [DraggableDirective, DraggableRxDirective, MovableDirective, MovableAreaDirective, DraggableHelperDirective]
})
export class DraggableModule { }
