import 'obsidian';

declare module 'obsidian' {
    interface WorkspaceLeaf {
        id: string;
    }
    interface DataAdapter {
        basePath: string;
    }
    interface App {
        plugins: {
            enabledPlugins: Set<string>;
        };
    }
    interface Component {
        _loaded: boolean;
    }
}
