export class VirtualScrollDebugOverlay {
    private container?: HTMLElement;
    private logList?: HTMLElement;
    private selectorInput?: HTMLInputElement;
    private distanceInput?: HTMLInputElement;
    private readonly originalConsoleLog = console.log.bind(console);
    private readonly originalConsoleWarn = console.warn.bind(console);
    private dragOffsetX = 0;
    private dragOffsetY = 0;
    private isDragging = false;
    private readonly onDragging = (event: MouseEvent) => {
        if (!this.isDragging || !this.container) {
            return;
        }
        const nextLeft = event.clientX - this.dragOffsetX;
        const nextTop = event.clientY - this.dragOffsetY;
        this.container.style.left = `${nextLeft}px`;
        this.container.style.top = `${nextTop}px`;
        this.container.style.right = 'auto';
        this.container.style.bottom = 'auto';
    };
    private readonly onDragEnd = () => {
        if (!this.isDragging) {
            return;
        }
        this.isDragging = false;
        this.doc.removeEventListener('mousemove', this.onDragging);
        this.doc.removeEventListener('mouseup', this.onDragEnd);
        if (this.container) {
            this.container.style.transition = '';
        }
    };

    constructor(private doc: Document) {}

    init() {
        if (!this.container) {
            this.createContainer();
        }
    }

    log(type: 'log' | 'warn', ...args: any[]) {
        this.init();
        if (type === 'warn') {
            this.originalConsoleWarn(...args);
        } else {
            this.originalConsoleLog(...args);
        }
        this.appendLog(type, ...args);
    }

    dispose() {
        this.container?.remove();
        this.container = undefined;
        this.logList = undefined;
        this.selectorInput = undefined;
        this.distanceInput = undefined;
        this.doc.removeEventListener('mousemove', this.onDragging);
        this.doc.removeEventListener('mouseup', this.onDragEnd);
        this.isDragging = false;
    }

    private createContainer() {
        const doc = this.doc;
        const container = doc.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '16px';
        container.style.top = '16px';
        container.style.right = 'auto';
        container.style.bottom = 'auto';
        container.style.width = '360px';
        container.style.maxHeight = '70vh';
        container.style.padding = '12px';
        container.style.boxSizing = 'border-box';
        container.style.background = 'rgba(17, 24, 39, 0.95)';
        container.style.color = '#e5e7eb';
        container.style.fontSize = '12px';
        container.style.fontFamily = 'Menlo, Consolas, monospace';
        container.style.border = '1px solid #1f2937';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.35)';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';

        const header = doc.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.cursor = 'move';
        header.addEventListener('mousedown', event => {
            if (!this.container) {
                return;
            }
            const rect = this.container.getBoundingClientRect();
            this.isDragging = true;
            this.dragOffsetX = event.clientX - rect.left;
            this.dragOffsetY = event.clientY - rect.top;
            this.container.style.transition = 'none';
            this.doc.addEventListener('mousemove', this.onDragging);
            this.doc.addEventListener('mouseup', this.onDragEnd);
            event.preventDefault();
        });

        const title = doc.createElement('div');
        title.textContent = 'Virtual Scroll Debug';
        title.style.fontWeight = '600';
        title.style.letterSpacing = '0.3px';

        const clearButton = doc.createElement('button');
        clearButton.type = 'button';
        clearButton.textContent = '清除日志';
        clearButton.style.background = '#374151';
        clearButton.style.color = '#e5e7eb';
        clearButton.style.border = '1px solid #4b5563';
        clearButton.style.borderRadius = '6px';
        clearButton.style.padding = '4px 10px';
        clearButton.style.cursor = 'pointer';
        clearButton.addEventListener('click', () => {
            if (this.logList) {
                this.logList.innerHTML = '';
            }
        });

        header.appendChild(title);
        header.appendChild(clearButton);

        const scrollForm = doc.createElement('div');
        scrollForm.style.display = 'grid';
        scrollForm.style.gridTemplateColumns = '1fr 90px 70px';
        scrollForm.style.gap = '6px';
        scrollForm.style.alignItems = 'center';

        const selectorInput = doc.createElement('input');
        selectorInput.placeholder = '滚动容器 selector';
        selectorInput.style.padding = '6px 8px';
        selectorInput.style.borderRadius = '6px';
        selectorInput.style.border = '1px solid #4b5563';
        selectorInput.style.background = '#111827';
        selectorInput.style.color = '#e5e7eb';
        selectorInput.autocomplete = 'off';

        const distanceInput = doc.createElement('input');
        distanceInput.placeholder = '滚动距离(px)';
        distanceInput.type = 'number';
        distanceInput.style.padding = '6px 8px';
        distanceInput.style.borderRadius = '6px';
        distanceInput.style.border = '1px solid #4b5563';
        distanceInput.style.background = '#111827';
        distanceInput.style.color = '#e5e7eb';

        const scrollButton = doc.createElement('button');
        scrollButton.type = 'button';
        scrollButton.textContent = '滚动';
        scrollButton.style.background = '#10b981';
        scrollButton.style.color = '#0b1c15';
        scrollButton.style.border = 'none';
        scrollButton.style.borderRadius = '6px';
        scrollButton.style.padding = '6px 10px';
        scrollButton.style.cursor = 'pointer';
        scrollButton.addEventListener('click', () => {
            const selector = selectorInput.value.trim();
            const distanceValue = Number(distanceInput.value ?? 0);
            const distance = Number.isFinite(distanceValue) ? distanceValue : 0;
            if (!selector) {
                this.log('warn', '请先填写滚动容器 selector');
                return;
            }
            const target = doc.querySelector(selector) as HTMLElement | null;
            if (!target) {
                this.log('warn', `未找到滚动容器: ${selector}`);
                return;
            }
            if (typeof target.scrollTo === 'function') {
                target.scrollTo({ top: distance, behavior: 'auto' });
            } else if (Object.prototype.hasOwnProperty.call(target, 'scrollTop')) {
                (target as HTMLElement & { scrollTop: number }).scrollTop = distance;
            } else {
                this.log('warn', '目标元素不支持滚动:', selector);
                return;
            }
            this.log('log', `已将 ${selector} 滚动到`, distance);
        });

        scrollForm.appendChild(selectorInput);
        scrollForm.appendChild(distanceInput);
        scrollForm.appendChild(scrollButton);

        const logList = doc.createElement('div');
        logList.style.height = '260px';
        logList.style.overflowY = 'auto';
        logList.style.background = '#0b1220';
        logList.style.border = '1px solid #1f2937';
        logList.style.borderRadius = '8px';
        logList.style.padding = '8px';
        logList.style.display = 'flex';
        logList.style.flexDirection = 'column';
        logList.style.gap = '6px';

        container.appendChild(header);
        container.appendChild(scrollForm);
        container.appendChild(logList);
        doc.body.appendChild(container);

        this.container = container;
        this.logList = logList;
        this.selectorInput = selectorInput;
        this.distanceInput = distanceInput;
    }

    private appendLog(type: 'log' | 'warn', ...args: any[]) {
        if (!this.logList) {
            return;
        }
        const item = this.doc.createElement('div');
        item.style.display = 'flex';
        item.style.gap = '6px';
        item.style.alignItems = 'flex-start';
        item.style.wordBreak = 'break-all';
        item.style.color = type === 'warn' ? '#fbbf24' : '#9ca3af';

        const time = this.doc.createElement('span');
        time.textContent = new Date().toLocaleTimeString();
        time.style.color = '#6b7280';
        time.style.flexShrink = '0';
        time.style.width = '72px';

        const text = this.doc.createElement('span');
        text.textContent = `[${type}] ${args.map(arg => this.formatValue(arg)).join(' ')}`;

        item.appendChild(time);
        item.appendChild(text);
        this.logList.appendChild(item);
        this.logList.scrollTop = this.logList.scrollHeight;
    }

    private formatValue(value: any) {
        if (typeof value === 'string') {
            return value;
        }
        try {
            return JSON.stringify(value);
        } catch (error) {
            return String(value);
        }
    }
}
