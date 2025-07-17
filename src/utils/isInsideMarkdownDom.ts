export function isInsideMarkdownDOM(element: Element): boolean {
    const leafContent = element.closest(
        '.workspace-leaf-content'
    ) as HTMLElement;
    return leafContent?.dataset.type === 'markdown';
}
