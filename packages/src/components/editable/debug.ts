type OverlayState = {
    left: number;
    top: number;
    collapsed: boolean;
    width: number;
    height: number;
};

export class VirtualScrollDebugOverlay {
    private static instance?: VirtualScrollDebugOverlay;
    private static readonly storageKey = 'slate_virtual_scroll_debug_overlay_state';
    private static readonly minWidth = 320;
    private static readonly minHeight = 240;
    private static readonly defaultWidth = 410;
    private static readonly defaultHeight = 480;

    static getInstance(doc: Document) {
        if (!this.instance) {
            this.instance = new VirtualScrollDebugOverlay(doc);
        }
        this.instance.init();
        return this.instance;
    }

    static log(doc: Document, type: 'log' | 'warn', ...args: any[]) {
        this.getInstance(doc).log(type, ...args);
    }

    static syncScrollTop(doc: Document, value: number) {
        const instance = this.getInstance(doc);
        instance.setScrollTopValue(value);
    }

    private container?: HTMLElement;
    private contentWrapper?: HTMLElement;
    private bubble?: HTMLElement;
    private logList?: HTMLElement;
    private selectorInput?: HTMLInputElement;
    private distanceInput?: HTMLInputElement;
    private collapseToggle?: HTMLButtonElement;
    private resizeHandle?: HTMLElement;
    private state: OverlayState = {
        left: 16,
        top: 16,
        collapsed: false,
        width: VirtualScrollDebugOverlay.defaultWidth,
        height: VirtualScrollDebugOverlay.defaultHeight
    };
    private readonly originalConsoleLog = console.log.bind(console);
    private readonly originalConsoleWarn = console.warn.bind(console);
    private dragOffsetX = 0;
    private dragOffsetY = 0;
    private isDragging = false;
    private isResizing = false;
    private resizeStartX = 0;
    private resizeStartY = 0;
    private resizeStartWidth = 0;
    private resizeStartHeight = 0;
    private dragMoved = false;
    private wasDragged = false;

    private readonly onDragging = (event: MouseEvent) => {
        if (!this.isDragging || !this.container) {
            return;
        }
        this.dragMoved = true;
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
        this.wasDragged = this.dragMoved;
        this.dragMoved = false;
        this.doc.removeEventListener('mousemove', this.onDragging);
        this.doc.removeEventListener('mouseup', this.onDragEnd);
        if (this.container) {
            const rect = this.container.getBoundingClientRect();
            this.state.left = rect.left;
            this.state.top = rect.top;
            this.persistState();
            this.container.style.transition = '';
        }
    };

    private readonly onResizing = (event: MouseEvent) => {
        if (!this.isResizing || !this.container) {
            return;
        }
        const deltaX = event.clientX - this.resizeStartX;
        const deltaY = event.clientY - this.resizeStartY;
        const nextWidth = Math.max(VirtualScrollDebugOverlay.minWidth, this.resizeStartWidth + deltaX);
        const nextHeight = Math.max(VirtualScrollDebugOverlay.minHeight, this.resizeStartHeight + deltaY);
        this.state.width = nextWidth;
        this.state.height = nextHeight;
        this.applySize();
    };

    private readonly onResizeEnd = () => {
        if (!this.isResizing) {
            return;
        }
        this.isResizing = false;
        this.doc.removeEventListener('mousemove', this.onResizing);
        this.doc.removeEventListener('mouseup', this.onResizeEnd);
        this.persistState();
    };

    private constructor(private doc: Document) {}

    init() {
        if (!this.container) {
            this.createContainer();
        } else {
            this.applyState();
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
        this.contentWrapper = undefined;
        this.bubble = undefined;
        this.logList = undefined;
        this.selectorInput = undefined;
        this.distanceInput = undefined;
        this.collapseToggle = undefined;
        this.resizeHandle = undefined;
        this.doc.removeEventListener('mousemove', this.onDragging);
        this.doc.removeEventListener('mouseup', this.onDragEnd);
        this.doc.removeEventListener('mousemove', this.onResizing);
        this.doc.removeEventListener('mouseup', this.onResizeEnd);
        this.isDragging = false;
        this.isResizing = false;
    }

    private createContainer() {
        this.loadState();
        const doc = this.doc;
        const container = doc.createElement('div');
        container.style.position = 'fixed';
        container.style.right = 'auto';
        container.style.bottom = 'auto';
        container.style.boxSizing = 'border-box';
        container.style.background = 'rgba(17, 24, 39, 0.95)';
        container.style.color = '#e5e7eb';
        container.style.fontSize = '12px';
        container.style.border = '1px solid #1f2937';
        container.style.borderRadius = '10px';
        container.style.fontFamily = 'Menlo, Consolas, monospace';
        container.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.35)';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.minWidth = `${VirtualScrollDebugOverlay.minWidth}px`;
        container.style.minHeight = `${VirtualScrollDebugOverlay.minHeight}px`;
        container.style.maxHeight = '80vh';
        container.style.cursor = 'default';
        container.addEventListener('mousedown', event => {
            if (this.state.collapsed) {
                this.startDrag(event);
            }
        });

        const header = doc.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.cursor = 'move';
        header.addEventListener('mousedown', event => {
            this.startDrag(event);
        });

        const title = doc.createElement('div');
        title.textContent = 'Virtual Scroll Debug';
        title.style.fontWeight = '600';
        title.style.letterSpacing = '0.3px';

        const actions = doc.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '6px';

        const collapseButton = doc.createElement('button');
        collapseButton.type = 'button';
        collapseButton.textContent = '折叠';
        collapseButton.style.background = '#1f2937';
        collapseButton.style.color = '#e5e7eb';
        collapseButton.style.border = '1px solid #374151';
        collapseButton.style.borderRadius = '6px';
        collapseButton.style.padding = '4px 8px';
        collapseButton.style.cursor = 'pointer';
        collapseButton.addEventListener('click', () => {
            this.setCollapsed(!this.state.collapsed);
        });

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

        actions.appendChild(collapseButton);
        actions.appendChild(clearButton);
        header.appendChild(title);
        header.appendChild(actions);

        const scrollForm = doc.createElement('div');
        scrollForm.style.display = 'grid';
        scrollForm.style.gridTemplateColumns = '1fr 110px 50px';
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
        logList.style.flex = '1';
        logList.style.minHeight = '160px';

        const bubble = doc.createElement('div');
        bubble.textContent = 'VS';
        bubble.style.display = 'none';
        bubble.style.alignItems = 'center';
        bubble.style.justifyContent = 'center';
        bubble.style.fontWeight = '700';
        bubble.style.fontSize = '14px';
        bubble.style.letterSpacing = '0.5px';
        bubble.style.width = '100%';
        bubble.style.height = '100%';
        bubble.style.userSelect = 'none';
        bubble.addEventListener('click', () => {
            if (this.wasDragged) {
                this.wasDragged = false;
                return;
            }
            this.setCollapsed(false);
        });

        const contentWrapper = doc.createElement('div');
        contentWrapper.style.display = 'flex';
        contentWrapper.style.flexDirection = 'column';
        contentWrapper.style.gap = '10px';
        contentWrapper.style.width = '100%';
        contentWrapper.style.height = '100%';
        contentWrapper.appendChild(header);
        contentWrapper.appendChild(scrollForm);
        contentWrapper.appendChild(logList);

        container.appendChild(contentWrapper);
        container.appendChild(bubble);
        const resizeHandle = doc.createElement('div');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '6px';
        resizeHandle.style.bottom = '6px';
        resizeHandle.style.width = '14px';
        resizeHandle.style.height = '14px';
        resizeHandle.style.cursor = 'nwse-resize';
        resizeHandle.style.borderRight = '2px solid #4b5563';
        resizeHandle.style.borderBottom = '2px solid #4b5563';
        resizeHandle.addEventListener('mousedown', event => {
            this.startResize(event);
        });
        container.appendChild(resizeHandle);
        doc.body.appendChild(container);

        this.container = container;
        this.contentWrapper = contentWrapper;
        this.bubble = bubble;
        this.logList = logList;
        this.selectorInput = selectorInput;
        this.distanceInput = distanceInput;
        this.collapseToggle = collapseButton;
        this.resizeHandle = resizeHandle;
        this.applyState();
    }

    private startDrag(event: MouseEvent) {
        if (event.button !== 0) {
            return;
        }
        if (!this.container) {
            return;
        }
        const rect = this.container.getBoundingClientRect();
        this.isDragging = true;
        this.wasDragged = false;
        this.dragMoved = false;
        this.dragOffsetX = event.clientX - rect.left;
        this.dragOffsetY = event.clientY - rect.top;
        this.container.style.transition = 'none';
        this.doc.addEventListener('mousemove', this.onDragging);
        this.doc.addEventListener('mouseup', this.onDragEnd);
        if (!this.state.collapsed) {
            event.preventDefault();
        }
    }

    private startResize(event: MouseEvent) {
        if (event.button !== 0 || this.state.collapsed) {
            return;
        }
        if (!this.container) {
            return;
        }
        const rect = this.container.getBoundingClientRect();
        this.isResizing = true;
        this.resizeStartX = event.clientX;
        this.resizeStartY = event.clientY;
        this.resizeStartWidth = rect.width;
        this.resizeStartHeight = rect.height;
        this.doc.addEventListener('mousemove', this.onResizing);
        this.doc.addEventListener('mouseup', this.onResizeEnd);
        event.preventDefault();
        event.stopPropagation();
    }

    private applyPosition() {
        if (!this.container) {
            return;
        }
        this.container.style.left = `${this.state.left}px`;
        this.container.style.top = `${this.state.top}px`;
    }

    private applySize() {
        if (!this.container) {
            return;
        }
        const width = Math.max(VirtualScrollDebugOverlay.minWidth, this.state.width || VirtualScrollDebugOverlay.defaultWidth);
        const height = Math.max(VirtualScrollDebugOverlay.minHeight, this.state.height || VirtualScrollDebugOverlay.defaultHeight);
        this.state.width = width;
        this.state.height = height;
        this.container.style.width = `${width}px`;
        this.container.style.height = `${height}px`;
    }

    private applyCollapsedState() {
        if (!this.container || !this.contentWrapper || !this.bubble || !this.collapseToggle) {
            return;
        }
        if (this.state.collapsed) {
            this.container.style.width = '36px';
            this.container.style.height = '36px';
            this.container.style.minWidth = '';
            this.container.style.minHeight = '';
            this.container.style.padding = '0';
            this.container.style.borderRadius = '50%';
            this.container.style.display = 'flex';
            this.container.style.flexDirection = 'row';
            this.container.style.alignItems = 'center';
            this.container.style.justifyContent = 'center';
            this.container.style.cursor = 'move';
            this.contentWrapper.style.display = 'none';
            this.bubble.style.display = 'flex';
            this.collapseToggle.textContent = '展开';
            this.resizeHandle.style.display = 'none';
        } else {
            this.applySize();
            this.container.style.padding = '12px';
            this.container.style.borderRadius = '10px';
            this.container.style.display = 'flex';
            this.container.style.flexDirection = 'column';
            this.container.style.gap = '10px';
            this.container.style.cursor = 'default';
            this.contentWrapper.style.display = 'flex';
            this.bubble.style.display = 'none';
            this.collapseToggle.textContent = '折叠';
            this.resizeHandle.style.display = 'block';
        }
    }

    private setCollapsed(collapsed: boolean) {
        this.state.collapsed = collapsed;
        this.applyCollapsedState();
        this.persistState();
    }

    private applyState() {
        this.applyPosition();
        this.applyCollapsedState();
    }

    private loadState() {
        try {
            const raw = this.doc.defaultView?.localStorage?.getItem(VirtualScrollDebugOverlay.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw) as Partial<OverlayState>;
                if (typeof parsed.left === 'number') {
                    this.state.left = parsed.left;
                }
                if (typeof parsed.top === 'number') {
                    this.state.top = parsed.top;
                }
                if (typeof parsed.collapsed === 'boolean') {
                    this.state.collapsed = parsed.collapsed;
                }
                if (typeof parsed.width === 'number') {
                    this.state.width = parsed.width;
                }
                if (typeof parsed.height === 'number') {
                    this.state.height = parsed.height;
                }
            }
        } catch {
            // ignore storage errors
        }
    }

    private persistState() {
        try {
            this.doc.defaultView?.localStorage?.setItem(VirtualScrollDebugOverlay.storageKey, JSON.stringify(this.state));
        } catch {
            // ignore storage errors
        }
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

    private setScrollTopValue(value: number) {
        if (this.distanceInput) {
            this.distanceInput.value = String(value ?? 0);
        }
    }
}
