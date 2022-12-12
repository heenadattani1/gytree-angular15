// ANGULAR
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';

// Pipes
/**
 * This component used for Pipe
 * @author Vikas thakkar <vikasthakkar@saeculumsolutions.com>
 *
 * Notes:-
 * Date: 11/04/2020 (Vikas thakkar <vikasthakkar@saeculumsolutions.com>) Date Pipe created
 */
@NgModule({
  declarations: [SafePipe],
  imports: [
    CommonModule,
  ],
  exports: [
    SafePipe
  ],
})
export class SafePipeModule { }
