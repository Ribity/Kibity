import React from 'react';
import MyButton from './MyButton';
import { ThemeContext } from '../theme-context';

export const ThemeButton = () => {
    const themeContext = React.useContext(ThemeContext);

    const onThemePress = () => {
        themeContext.toggleTheme();
    };
    return (
            <MyButton style={{marginVertical: 5, backgroundColor: 'grey'}}
                      onPress={onThemePress}
                      title={"Light/Dark"}>
            </MyButton>
    );
};