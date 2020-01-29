import React from 'react';
import {Button, Layout} from '@ui-kitten/components';
import { ThemeContext } from '../theme-context';

export const ThemeButton = () => {
    const themeContext = React.useContext(ThemeContext);

    const onThemePress = () => {
        themeContext.toggleTheme();
        console.log(themeContext.theme);
    };
    return (
            <Button style={{marginVertical: 5, backgroundColor: 'grey'}}
                    onPress={onThemePress}>Toggle Light/Dark Theme</Button>
    );
};