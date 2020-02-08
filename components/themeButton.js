import React from 'react';
import {MyButton} from './MyButton';
import { ThemeContext } from '../theme-context';

export const ThemeButton = () => {
    const themeContext = React.useContext(ThemeContext);

    const onThemePress = () => {
        themeContext.toggleTheme();
    };

    let myText = 'Dark';
    let backColor = 'mediumpurple';
    let textColor = 'goldenrod';
    let borderColor = 'goldenrod';

        if (themeContext.theme === 'dark') {
        myText = "Light";
        backColor = 'goldenrod';
        textColor = 'purple';
        borderColor = 'purple';
    }

    return (
            <MyButton buttonStyle={{backgroundColor: backColor, borderColor: borderColor}}
                      textStyle={{color: textColor}}
                      onPress={onThemePress}
                      title={myText}>
            </MyButton>
    );
};