import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, Optional, EmbeddedViewRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BaseService } from '../utils/base.service';
import { ToastComponent } from './toast.component';

@Injectable()
export class ToastService extends BaseService {
    constructor(resolver: ComponentFactoryResolver, applicationRef: ApplicationRef, injector: Injector) {
        super(resolver, applicationRef, injector);
    }

    /**
     * 构建toast并显示
     *
     * @param {string} [text] 文本（可选）
     * @param {number} [time] 显示时长后自动关闭（单位：ms），0 表示永久（可选）
     * @param {string} [icon] icon图标Class名（可选）
     * @param {('success' | 'loading')} [type] 类型（可选）
     * @returns {ToastComponent}
     */
    show(text?: string, time?: number, icon?: string, type?: 'success' | 'loading') {
        const componentRef = this.build(ToastComponent);

        if (type) componentRef.instance.type = type;
        if (text) componentRef.instance.text = text;
        if (icon) componentRef.instance.icon = icon;
        if (time) componentRef.instance.time = time;
        componentRef.instance.hide.subscribe(() => {
            setTimeout(() => {
                componentRef.destroy();
            }, 300);
        });
        return componentRef.instance.onShow();
    }

    /**
     * 关闭最新toast
     */
    hide() {
        this.destroy();
    }

    /**
     * 构建成功toast并显示
     *
     * @param {string} [text] 文本（可选）
     * @param {number} [time] 显示时长后自动关闭（单位：ms）（可选）
     * @param {string} [icon] icon图标Class名（可选）
     * @returns {ToastComponent}
     */
    success(text?: string, time?: number, icon?: string) {
        return this.show(text, time, icon, 'success');
    }

    /**
     * 构建加载中toast并显示
     *
     * @param {string} [text] 文本（可选）
     * @param {number} [time] 显示时长后自动关闭（单位：ms）（可选）
     * @param {string} [icon] icon图标Class名（可选）
     * @returns {ToastComponent}
     */
    loading(text?: string, time?: number, icon?: string) {
        return this.show(text, time, icon, 'loading');
    }
}
