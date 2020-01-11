
import React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { mapping, light, dark } from '@eva-design/eva';
import { AppNavigator } from './navigation';
import { ThemeContext } from './theme-context';
// import { default as customMapping } from './custom-mapping.json'; // <-- import custom mapping

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
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <ApplicationProvider
                    mapping={mapping}
                    theme={currentTheme}
                    // customMapping={customMapping}
                    >
                    <AppNavigator/>
                </ApplicationProvider>
            </ThemeContext.Provider>
        </React.Fragment>
    );
}


// import React from 'react';
// import { ApplicationProvider, Layout, Button } from '@ui-kitten/components';
// import { mapping, dark as darkTheme } from '@eva-design/eva';
// import { default as appTheme } from './custom-theme.json'; // <-- Import app theme
//
// const theme = { ...darkTheme, ...appTheme };
//
// const HomeScreen = () => (
//     <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Button>HOME</Button>
//     </Layout>
// );
//
// const App = () => (
//     <ApplicationProvider mapping={mapping} theme={theme}>
//         <HomeScreen/>
//     </ApplicationProvider>
// );



// import React from 'react';
// import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
// import { EvaIconsPack } from '@ui-kitten/eva-icons';
// import { mapping, light, dark } from '@eva-design/eva';
// import { AppNavigator } from './navigation.component';
// import { ThemeContext } from './theme-context';
//
// const themes = { light, dark };
//
// const App = () => {
//
//     const [theme, setTheme] = React.useState('light');
//     const currentTheme = themes[theme];
//
//     const toggleTheme = () => {
//         const nextTheme = theme === 'light' ? 'dark' : 'light';
//         setTheme(nextTheme);
//     };
//
//     return (
//         <React.Fragment>
//             <IconRegistry icons={EvaIconsPack}/>
//             <ThemeContext.Provider value={{ theme, toggleTheme }}>
//                 <ApplicationProvider mapping={mapping} theme={currentTheme}>
//                     <AppNavigator/>
//                 </ApplicationProvider>
//             </ThemeContext.Provider>
//         </React.Fragment>
//     );
// };



export default App;
