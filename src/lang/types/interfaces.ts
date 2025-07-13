export interface LocaleSchema {
    adapters: {
        pickerMode: {
            notice: {
                error: string;
            };
        };
    };
    commands: {
        pickerMode: {
            notice: {
                disabled: string;
            };
        };
        togglePanels: {
            notice: {
                hidden: string;
                noActiveImages: string;
                noMd: string;
                shown: string;
            };
        };
    };
    image: {
        controlPanel: {
            fold: {
                fold: {
                    expanded: string;
                    folded: string;
                };
                name: string;
            };
            move: {
                down: string;
                downLeft: string;
                downRight: string;
                left: string;
                name: string;
                right: string;
                up: string;
                upLeft: string;
                upRight: string;
            };
            service: {
                fullscreen: {
                    name: string;
                    off: string;
                    on: string;
                };
                hide: {
                    hidden: string;
                    name: string;
                    shown: string;
                };
                name: string;
                touch: {
                    off: string;
                    on: string;
                };
            };
            zoom: {
                in: string;
                name: string;
                out: string;
                reset: string;
            };
        };
    };
    pickerMode: {
        tooltip: {
            imageState: {
                nonInitialized: string;
                off: string;
                on: string;
            };
            onExit: string;
            onStart: string;
        };
    };
    settings: {
        pages: {
            about: {
                githubPage: {
                    linkButtonTooltip: string;
                    name: string;
                };
            };
            debug: {
                aboutExportedLogs: {
                    desc: string[];
                    name: string;
                };
                clearLogsStorage: {
                    clearButtonTooltip: string;
                    desc: string;
                    name: string;
                    notice: {
                        successfully: string;
                    };
                };
                copyLogs: {
                    copyButtonTooltip: string;
                    name: string;
                    notice: {
                        logsNotFound: string;
                        successfully: string;
                    };
                };
                enableLogging: {
                    desc: string;
                    name: string;
                };
                exportLogs: {
                    exportButtonTooltip: string;
                    name: string;
                };
                logLevel: {
                    desc: string;
                    name: string;
                };
                reportIssue: {
                    desc: string[];
                    linkButtonTooltip: string;
                    name: string;
                };
            };
            images: {
                controls: {
                    serviceIgnoring: {
                        desc: string;
                        name: string;
                    };
                    visibility: {
                        desc: string;
                        dropdown: {
                            always: string;
                            focus: string;
                            hover: string;
                        };
                        name: string;
                        tooltips: {
                            always: string;
                            focus: string;
                            hover: string;
                        };
                    };
                };
                general: {
                    fold: {
                        autoFoldOnFocusChange: {
                            name: string;
                        };
                        foldByDefault: {
                            name: string;
                        };
                        header: string;
                    };
                    interactive: {
                        activationMode: {
                            desc: string;
                            dropdown: {
                                immediate: string;
                                lazy: string;
                            };
                            name: string;
                            tooltips: {
                                immediate: string;
                                lazy: string;
                            };
                        };
                        autoDetect: {
                            desc: string[];
                            name: string;
                        };
                        header: string;
                        pickerMode: {
                            desc: string[];
                            name: string;
                        };
                    };
                    size: {
                        desc: string;
                        expanded: {
                            desc: string[];
                            name: string;
                        };
                        folded: {
                            desc: string[];
                            name: string;
                        };
                        header: string;
                        labels: {
                            height: string;
                            width: string;
                        };
                        placeholders: {
                            height: string;
                            width: string;
                        };
                        saveButtonTooltip: string;
                        validation: {
                            fixErrors: string;
                            invalidHeight: string;
                            invalidWidth: string;
                            nothingToSave: string;
                            savedSuccessfully: string;
                        };
                    };
                };
                layout: {
                    buttonsLayout: {
                        desc: string;
                        modal: {
                            preset: {
                                buttons: {
                                    full: string;
                                    minimal: string;
                                    presentation: string;
                                };
                                name: string;
                            };
                            title: string;
                        };
                        name: string;
                        tooltip: string;
                    };
                    controlsLayout: {
                        desc: string;
                        modal: {
                            availablePanels: {
                                desc: string[];
                                name: string;
                            };
                            howTo: {
                                desc: string[];
                                name: string;
                            };
                            panelConfig: {
                                desc: string;
                                name: string;
                            };
                            title: string;
                        };
                        name: string;
                        tooltip: string;
                    };
                };
                presets: {
                    addNewImagePreset: {
                        desc: string[];
                        header: string;
                        notice: {
                            newConfigAdded: string;
                        };
                        placeholders: {
                            name: string;
                            selector: string;
                        };
                        tooltips: {
                            infoButton: string;
                            saveButton: string;
                        };
                        undoStack: {
                            addAction: string;
                        };
                        userGuideModal: {
                            customSelectors: {
                                desc: string;
                                name: string;
                            };
                            findingSelectors: {
                                desc: string[];
                                name: string;
                            };
                            header: string;
                            howItWorks: {
                                desc: string[];
                                name: string;
                            };
                            video: {
                                failed: string;
                                loading: string;
                            };
                            workingModes: {
                                desc: string[];
                                name: string;
                            };
                        };
                    };
                    availableImageConfigs: {
                        header: string;
                        item: {
                            actions: {
                                changes: {
                                    name: string;
                                    selector: string;
                                };
                                delete: string;
                                disable: string;
                                edit: string;
                                enable: string;
                            };
                            buttons: {
                                cancel: string;
                                delete: string;
                                edit: string;
                                options: string;
                                save: string;
                            };
                            toggle: {
                                disable: string;
                                enable: string;
                            };
                        };
                        optionsModal: {
                            desc: string;
                            name: string;
                            panels: {
                                action: string;
                                header: string;
                                states: {
                                    off: string;
                                    on: string;
                                };
                            };
                        };
                        pagination: {
                            buttons: {
                                editingBlocked: string;
                                next: {
                                    disabled: string;
                                    enabled: string;
                                };
                                previous: {
                                    disabled: string;
                                    enabled: string;
                                };
                            };
                            page: string;
                        };
                        perPageSlider: {
                            name: string;
                        };
                    };
                    history: {
                        notices: {
                            nothingToRedo: string;
                            nothingToUndo: string;
                        };
                        tooltips: {
                            redo: {
                                available: string;
                                nothing: string;
                            };
                            undo: {
                                available: string;
                                nothing: string;
                            };
                        };
                    };
                    unitsValidation: {
                        bothInvalid: string;
                        fillOutField: string;
                        invalidSelectorPrefix: string;
                        nameAlreadyExists: string;
                        nothingToSave: string;
                        oneInvalid: string;
                        selectorAlreadyExists: string;
                    };
                };
            };
        };
        toolbar: {
            reset: {
                notice: string;
                tooltip: string;
            };
            sidebar: {
                tooltip: string;
            };
        };
    };
}
