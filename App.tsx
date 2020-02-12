import React from 'react';
import { ApplicationProvider, Text } from '@ui-kitten/components';
import { mapping, light, dark } from '@eva-design/eva';
import { AppNavigator } from './navigation';
import { ThemeContext } from './theme-context';

// import { default as customMapping } from './custom-mapping.json'; // <-- import custom mapping

import { Provider } from 'react-redux';
import { rootReducer } from './reducers/RootReducer'
import { createStore } from 'redux';

// The yellowBox thing hides warning on Android
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const store = createStore(rootReducer);

const themes = { light, dark };

const App = () => {
    const [theme, setTheme] = React.useState('light');
    const currentTheme = themes[theme];

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

    // console.log("Calling init");
    // myfuncs.init();

    return (
        <React.Fragment>
            <ThemeContext.Provider value={{theme, toggleTheme}}>
                <Provider store={store}>
                    <ApplicationProvider
                        mapping={mapping}
                        theme={currentTheme}
                        // customMapping={customMapping}
                    >
                        <AppNavigator/>
                    </ApplicationProvider>
                </Provider>
            </ThemeContext.Provider>
        </React.Fragment>
    );

};

export default App;