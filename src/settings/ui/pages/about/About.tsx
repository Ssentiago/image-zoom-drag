import { t } from '@/lang';

import { FC } from 'react';

import { OSetting } from '@obsidian-lib/native-react-components';

import { useSettingsContext } from '../../core/SettingsContext';
import { FooterContent, Info, Slogan } from './About.styled';

const About: FC = () => {
    const { plugin } = useSettingsContext();

    return (
        <>
            <OSetting name={t.settings.pages.about.githubPage.name}>
                <button
                    aria-label={
                        t.settings.pages.about.githubPage.linkButtonTooltip
                    }
                    onClick={() => {
                        window.open(
                            'https://github.com/Ssentiago/interactify/',
                            '_blank'
                        );
                    }}
                    data-icon={'github'}
                />
            </OSetting>

            <OSetting name={'Help'}>
                <button
                    data-icon={'message-circle-question'}
                    aria-label={'Open the help modal window'}
                    onClick={() => plugin.help.showModal('full')}
                />
            </OSetting>

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
