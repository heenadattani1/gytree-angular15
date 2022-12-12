import { Directive, ElementRef, Renderer2, OnInit, Input, HostListener } from '@angular/core';

@Directive({ selector: '[appMaskInput]' })

export class MaskInputDirective implements OnInit {

    @Input() appMaskValue: string;

    constructor(
        private elRef: ElementRef,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (this.appMaskValue && (this.appMaskValue.length === 2 || this.appMaskValue.length === 5) && event.key !== 'Backspace') {
            this.renderer.setProperty(this.elRef.nativeElement, 'value', this.appMaskValue + '/');
        }
    }
}