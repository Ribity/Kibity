import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { Divider, Icon, Layout, Text, TopNavigation, TopNavigationAction, Drawer } from '@ui-kitten/components';

const BackIcon = (style) => (
    <Icon {...style} name='arrow-back' />
);


const drawerData = [
    { title: 'Home' },
    { title: 'Messages' },
    { title: 'Settings' },
    { title: 'Articles' },
    { title: 'Ecommerce' },
    { title: 'Chat' },
];


export const DetailsScreen = ({ navigation }) => {

    const navigateBack = () => {
        navigation.goBack();
    };

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
    );

    const onRouteSelect = (index) => {
        const route = drawerData[index];
        navigation.navigate(route.title);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation title='Magical Adventure' alignment='center' leftControl={BackAction()}/>
            <Divider/>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category='h1'>DETAILS</Text>
            </Layout>

            <Drawer
                data={drawerData}
                onSelect={onRouteSelect}
            />
        </SafeAreaView>
    );



};
