import { FC } from 'react';

import { ReactObsidianSetting } from 'react-obsidian-setting';

import { useSettingsContext } from '../../core/SettingsContext';
import { FooterContent, Info, Slogan } from './About.styled';

const About: FC = () => {
    const { plugin } = useSettingsContext();

    return (
        <>
            <ReactObsidianSetting
                name={'GitHub page'}
                addButtons={[
                    (button) => {
                        button.setIcon('github');
                        button.setTooltip('Go to GitHub page of this plugin');
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
