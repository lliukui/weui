import { Component, ViewEncapsulation, forwardRef } from '@angular/core';
import { BarComponent } from './bar.component';

/**
 * 顶部选项卡
 */
@Component({
    selector: 'weui-navbar',
    template: `
    <div class="weui-navbar">
        <div class="weui-navbar__item"
            [ngClass]="{'weui-bar__item_on': item.active}"
            [class.disabled]="item.disabled"
            *ngFor="let item of tabs" (click)="item.active=true">{{item.heading}}</div>
    </div>
    <div class="weui-tab__panel"><ng-content></ng-content></div>
    `,
    providers: [{provide: BarComponent, useExisting: forwardRef(() => NavbarComponent) }],
    host: {
        '[class.weui-tab]': 'true'
    },
    styleUrls: [ './tab.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent extends BarComponent {
    constructor() {
        super();
    }
}
