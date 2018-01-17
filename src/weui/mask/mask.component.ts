import { Component, Input, EventEmitter, Output, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'weui-mask',
    template: `
    <div class="weui-mask" [ngClass]="{'weui-mask__visible': _shown }" (click)="hide(true)">
        <div class="weui-mask__content" [ngClass]="placement !== 'none' ? 'weui-mask__' + placement : ''">
            <div [ngStyle]="{'background-color':bg}">
                <div *ngIf="loading"><i class="weui-loading weui-icon_toast"></i></div>
                <ng-content></ng-content>
            </div>
        </div>
    </div>
    `,
    styleUrls: [ './mask.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class MaskComponent implements OnDestroy {
    /**
     * 点击是否允许关闭（默认：false）
     *
     * @type {boolean}
     */
    @Input() backdrop: boolean = false;

    /**
     * 内容方向（默认：vertical）
     * + `top`: 顶部居中
     * + `bottom`: 底部居中
     * + `vertical-left`: 垂直居左
     * + `vertical`: 垂直居中
     * + `vertical-right`: 垂直居右
     * + `none`: 无
     *
     * @type {string}
     */
    @Input() placement: 'top' | 'bottom' | 'vertical' | 'vertical-left' | 'vertical-right' | 'none' = 'vertical';

    /**
     * 内容背景色（默认：无）
     *
     * @type {string}
     */
    @Input() bg = '';

    /**
     * 内容为Loading效果（默认：false）
     *
     * @type {boolean}
     */
    @Input() loading = false;

    /**
     * 关闭回调
     */
    @Output() close = new EventEmitter();

    private observer: Observer<void>;
    _shown: boolean = false;

    /**
     * 显示，并返回一个Observable
     */
    show(): Observable<void> {
        setTimeout(() => {
            this._shown = true;
        });
        return Observable.create((observer: Observer<void>) => {
            this.observer = observer;
        });
    }

    /**
     * 隐藏
     *
     * @param {boolean} [is_backdrop=false] 是否手动点击关闭（默认：false）
     */
    hide(is_backdrop: boolean = false) {
        if (is_backdrop === true && this.backdrop === false) return false;

        this._shown = false;
        this.close.emit();
    }

    ngOnDestroy(): void {
        if (this.observer && this.observer instanceof Subscription) {
            (<Subscription>this.observer).unsubscribe();
        }
    }

}
