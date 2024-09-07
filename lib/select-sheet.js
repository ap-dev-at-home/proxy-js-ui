import { $p } from './../proxy-js/core.js';

export class SelectSheet extends HTMLElement {
    model = null;
    
    constructor(m) {
        super();

        this.attachShadow({ mode: 'open', delegatesFocus: true });

        this.model = m;
    }

    connectedCallback() {

        this.shadowRoot.innerHTML = 
        `
            <style>
                .select-sheet {
                    display: block;
                    padding: 4px 4px 4px 4px;
                    width: 280px;
                    max-width: 100%;
                    height: auto;
                    border-radius: 5px;
                    background-color: rgba(255, 255, 255, 1.0);
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
                    z-index: 99999;
                }

                .select-sheet-title {
                    padding: 4px 4px 4px 18px;
                    margin-top: 4px;
                    margin-bottom: 12px;
                    color: rgba(0, 0, 0, 0.85);
                    font-size: 18px;
                    font-weight: bold;
                }

                .select-sheet-items {
                    display: block;
                    padding: 1px 1px 1px 1px;
                    width: 100%;
                    height: auto;
                    max-height: 400px;
                    margin-bottom: 4px;
                    overflow-y: auto;
                }

                .select-sheet-item {
                    padding: 8px 12px 8px 18px;
                    color: rgba(0, 0, 0, 0.85);
                    font-size: 18px;
                    border-radius: 5px;
                    transition: background-color 0.3s linear;
                }

                .select-sheet-item:hover {
                    cursor: pointer;
                    background-color: rgba(128, 128, 128, 0.25);
                }

                .select-sheet-item:focus {
                    outline: 1px dotted rgba(0, 0, 0, 0.25);
                }

                .select-sheet-item-cancel {
                    font-size: 14px;
                    font-weight: bold;
                    float: right;
                    margin: 4px 8px 4px 8px;
                    padding: 2px 2px 2px 2px;
                    color: rgba(128, 0, 0, 1.0);
                    transition: color 0.3s linear;
                    border: none;
                    background-color: transparent;
                }

                .select-sheet-item-cancel:hover {
                    cursor: pointer;
                    color: rgba(255, 0, 0, 1.0);
                }

                .select-sheet-item-cancel:focus {
                    outline: 1px dotted rgba(0, 0, 0, 0.25);
                }
            </style>

            <div class="select-sheet" @click&.select-sheet-item="onClickItem(item)">
                <div class="select-sheet-title">{{model.title}}</div>
                <div class="select-sheet-items">
                    <div p-for="item in model.items" tabindex="0" class="select-sheet-item">
                        <div>{{item.text}}</div>
                    </div>
                </div>
                <div style="margin-top: 4px;">
                    <button class="select-sheet-item-cancel" @click="onCancel()">{{model.cancel ?? 'CANCEL'}}</button>
                    <div style="clear: both;">
                </div>
            </div>
        `;
        
        $p.bind(this, this.shadowRoot);

        this.onBlur = this.onBlur.bind(this);

        this.shadowRoot.addEventListener('blur', this.onBlur, true);

        this.shadowRoot.querySelector('.select-sheet-item')?.focus();
    }

    disconnectedCallback() {
        this.shadowRoot.removeEventListener('blur', this.onBlur, true);
        $p.unbind(this.shadowRoot);
    }

    onCancel() {
        this.dispatchEvent(new CustomEvent('close', {
            detail: {
                action: 'cancel'
            },
            bubbles: true,
            cancelable: true,
            composed: true
        }));

        this.remove();
    }

    onBlur(e) {
        if (this.shadowRoot.contains(e.relatedTarget)) {
            return;
        }

        this.dispatchEvent(new CustomEvent('close', {
            detail: {
                action: 'unfocus'
            },
            bubbles: true,
            cancelable: true,
            composed: true
        }));

        this.remove();
    }

    onClickItem(item) {
        this.dispatchEvent(new CustomEvent('close', {
            detail: {
                action: 'select',
                item: item._unwrap()
            },
            bubbles: true,
            cancelable: true,
            composed: true
        }));

        this.remove();
    }

    remove() {
        this.shadowRoot.removeEventListener('blur', this.onBlur, true);
        if (this.shadowRoot.host.parentElement?.contains(this.shadowRoot.host)) {
            this.shadowRoot.host.parentElement.removeChild(this.shadowRoot.host);
        }
    }
}

customElements.define('select-sheet', SelectSheet);