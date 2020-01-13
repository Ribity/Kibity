
import React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { mapping, light, dark } from '@eva-design/eva';
import { AppNavigator } from './navigation';
import { ThemeContext } from './theme-context';
// import { default as customMapping } from './custom-mapping.json'; // <-- import custom mapping

import { Provider } from 'react-redux';
import { rootReducer } from './reducers/RootReducer'
import { createStore } from 'redux';

const store = createStore(rootReducer);

const themes = { light, dark };

const App = () => {
    const [theme, setTheme] = React.useState('light');
    const currentTheme = themes[theme];

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

        return (
            <React.Fragment>
                <IconRegistry icons={EvaIconsPack}/>
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
