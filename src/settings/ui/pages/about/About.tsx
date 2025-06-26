import { FC } from 'react';

import { ReactObsidianSetting } from '@obsidian-devkit/native-react-components';

import { t } from '../../../../lang';
import { useSettingsContext } from '../../core/SettingsContext';
import { FooterContent, Info, Slogan } from './About.styled';

const About: FC = () => {
    const { plugin } = useSettingsContext();

    return (
        <>
            <ReactObsidianSetting
                name={t.settings.pages.about.githubPage.name}
                buttons={[
                    (button) => {
                        button.setIcon('github');
                        button.setTooltip(
                            t.settings.pages.about.githubPage.linkButtonTooltip
                        );
                        button.onClick(() => {
                            window.open(
                                'https://github.com/Ssentiago/interactify/',
                                '_blank'
                            );
                        });
                        return button;
                    },
                ]}
            />

            <FooterContent>
                <Slogan>Make Obsidian images and diagrams Interactify!</Slogan>
                <Info>
                    {plugin.manifest.version}
                    <span>•</span>
                    <a
                        href='https://github.com/Ssentiago/interactify/blob/main/LICENSE'
                        target='_blank'
                    >
                        Apache-2.0
                    </a>
                    <span>•</span>
                    by{' '}
                    <a
                        href={'https://github.com/gitcpy'}
                        target={'_blank'}
                    >
                        gitcpy
                    </a>{' '}
                    and{' '}
                    <a
                        href={'https://github.com/Ssentiago'}
                        target={'_blank'}
                    >
                        Ssentiago
                    </a>
                </Info>
            </FooterContent>
        </>
    );
};

export default About;
