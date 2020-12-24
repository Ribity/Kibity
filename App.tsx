import React from 'react';
import { ApplicationProvider, Text } from '@ui-kitten/components';
import { mapping, light, dark } from '@eva-design/eva';
import { AppNavigator } from './navigation';
import { ThemeContext } from './theme-context';
import { RootSiblingParent } from 'react-native-root-siblings';

// import { default as customMapping } from './custom-mapping.json'; // <-- import custom mapping

import { Provider } from 'react-redux';
import { rootReducer } from './reducers/RootReducer'
import { createStore } from 'redux';

const store = createStore(rootReducer);

const themes = { light, dark };

import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    'objects will be removed'      // This gets rid of Expo v40 warning about global constants in react-native-reanimated
]);

const App = () => {
    const [theme, setTheme] = React.useState('light');
    const currentTheme = themes[theme];

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };
    return (
        <React.Fragment>
            <ThemeContext.Provider value={{theme, toggleTheme}}>
                <Provider store={store}>
                    <RootSiblingParent>
                        <ApplicationProvider
                            mapping={mapping}
                            theme={currentTheme}
                            // customMapping={customMapping}
                        >
                            <AppNavigator/>
                        </ApplicationProvider>
                    </RootSiblingParent>
                </Provider>
            </ThemeContext.Provider>
        </React.Fragment>
    );
};

export default App;