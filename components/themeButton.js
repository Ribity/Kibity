import React from 'react';
import {Button, Layout} from '@ui-kitten/components';
import { ThemeContext } from '../theme-context';

export const ThemeButton = () => {
    const themeContext = React.useContext(ThemeContext);

    const onThemePress = () => {
        themeContext.toggleTheme();
    };
    return (
        <Layout style={{flex: 1, justifyContent: 'top', alignItems: 'center'}}>
            <Button style={{marginVertical: 10, backgroundColor: 'grey'}}
                    onPress={onThemePress}>Toggle Light/Dark Theme</Button>
        </Layout>
    );
};