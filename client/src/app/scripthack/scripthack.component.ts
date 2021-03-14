import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
 
@Component({
    selector: 'app-script-hack',
    templateUrl: './scripthack.component.html'
})
export class ScripthackComponent implements AfterViewInit {
    @Input()
    src: string;
 
    @Input()
    type: string;
 
    @ViewChild('script') script: ElementRef;
 
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    }
 
    convertToScript() {
        const element = this.script.nativeElement;
        const parent = element.parentElement;
        const script = document.createElement('script');
        script.type = this.type ? this.type : 'text/javascript';
        if (this.src) {
            script.src = this.src;
        }
 
        if (element.innerHTML) {
            script.innerHTML = element.innerHTML;
        }
 
        parent.parentElement.replaceChild(script, parent);
    }
 
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.convertToScript();
        }
    }
}