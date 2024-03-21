/**
 * NAV MODULE
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// IMPORT THE SCREENS
import Login from './screens/Login';
import DashboardScreen from './screens/Dashboard';
import Profile from './screens/Profile';
import Register from './screens/Register';
import SingleProduct from './screens/SingleProduct';
import Contact from './screens/Contact';
import Brands from './screens/Brands'
import BrandSingle from './screens/BrandSingle';

const Stack = createNativeStackNavigator();

export default function AppNav() {

    return (
        <NavigationContainer>

            {
                // DEFAULT SCREEN WILL BE THE LOGIN.JS 
            }
            <Stack.Navigator
                initialRouteName='Login'
                headerMode='screen'
            >
                {
                    // THE FOLLOWING WILL BE THE SCREENS OR THE NAVIGATION THAT WE ARE GOING TO USE FOR THIS PROJECT MOBILE APP
                    //LOGIN, REGISTER, DASHBOARD(WILL BE THE HOME WHEN YOU LOGGED IN), SINGLEPRODUCT, CONTACT & PROFILE
                }
                <Stack.Screen
                    name='Login'
                    component={Login}
                    options={({ route }) => ({ title: route.params?.screenTitle || 'Laptop Hub - Login' })}
                />

                <Stack.Screen
                    name='Register'
                    component={Register}
                    options={({ route }) => ({ title: route.params?.screenTitle || 'Laptop Hub - Register' })}
                />

                <Stack.Screen
                    name='Dashboard'
                    component={DashboardScreen}
                    options={({ route }) => ({ title: route.params?.screenTitle || 'Laptop Hub - Dashboard' })}
                />

                <Stack.Screen
                    name='SingleProduct'
                    component={SingleProduct}
                    options={({ route }) => ({ title: route.params?.screenTitle || 'Laptop Hub - Product' })}
                />

                <Stack.Screen
                    name='Contact'
                    component={Contact}
                    options={({ route }) => ({ title: route.params?.screenTitle || 'Laptop Hub - Contact Us' })}
                />

                <Stack.Screen
                    name='Profile'
                    component={Profile}
                    options={({ route }) => ({ title: route.params?.screenTitle || 'Laptop Hub - Profile' })}
                />

                <Stack.Screen
                    name='Brands'
                    component={Brands}
                    options={({ route }) => ({ title: route.params?.screenTitle || 'Laptop Hub - Brands' })}
                />

                <Stack.Screen
                    name='BrandSingle'
                    component={BrandSingle}
                    options={({ route }) => ({ title: route.params?.screenTitle || 'Laptop Hub - Single Brand View' })}
                />

            </Stack.Navigator>

        </NavigationContainer>
    )
}