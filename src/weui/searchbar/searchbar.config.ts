import { Injectable } from '@angular/core';

@Injectable()
export class SearchBarConfig {
    /**
     * placeholder
     * 
     * @type {string}
     * @default 搜索
     */
    placeholder?: string = '搜索';

    /**
     * 取消按键文字
     * 
     * @type {string}
     * @default 取消
     */
    cancelText?: string = '取消';

    /**
     * 去抖时长（单位：ms）
     * 
     * @type {number}
     * @default 300
     */
    debounceTime?: number = 300;
}
