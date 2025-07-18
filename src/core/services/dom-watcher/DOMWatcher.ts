import InteractifyPlugin from '@/core/interactify-plugin';

import { Component } from 'obsidian';

export default class DOMWatcher extends Component {
    observer: MutationObserver | null = null;

    private readonly subscribers = new Map<
        (mutation: MutationRecord) => boolean,
        (mutation: MutationRecord) => void
    >();

    constructor() {
        super();
        this.enable();
    }

    enable() {
        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                this.processMutation(mutation);
            }
        });
        this.observer.observe(document.body, {
            childList: true, // Add/removal of children
            subtree: true, // monitor all subtree
            attributes: true, // changes in attributes
            attributeOldValue: true, // Old attributes
        });
    }

    private processMutation(mutation: MutationRecord) {
        for (const [condition, callback] of this.subscribers) {
            if (condition(mutation)) {
                callback(mutation);
            }
        }
    }

    onunload() {
        this.observer?.disconnect();
        this.subscribers.clear();
    }

    subscribe(
        condition: (mutation: MutationRecord) => boolean,
        callback: (mutation: MutationRecord) => void
    ) {
        this.subscribers.set(condition, callback);
    }
}
