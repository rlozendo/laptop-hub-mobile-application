import React, { useState, useEffect, useLayoutEffect } from 'react';
import { TextInput, ScrollView, View, Text, Image, ActivityIndicator, TouchableHighlight, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { db, auth, storage } from '../firebaseConfig';
import { onValue, ref, set } from 'firebase/database';
import { signOut } from 'firebase/auth';
import he from 'he';
import PagerView from 'react-native-pager-view';
import * as MailComposer from 'expo-mail-composer';

import Header from '../partials/Header';
import Footer from '../partials/Footer';
import Laptops from '../Laptops'

import Styles from '../Styles';

const BrandSingle = (props) => {
    const route = useRoute();
    const { userId, brandId, title, base } = route.params;

    // Set the screen title
    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: `Laptop Hub - ${title}`, // Use the passed title or a default one
        });
    }, [props.navigation, title]);


    return (
        <GestureHandlerRootView>
            <View style={Styles.scrollView1}>

                {/* HEADER START */}
                <Header userId={userId} />
                {/* FOOTER START */}
                <Footer userId={userId} />
                <ScrollView>
                    <View style={Styles.container}>
                        <Text style={{ display: 'none' }} >User ID: {userId}</Text>
                        <View>
                            <Laptops userId={userId} brandId={brandId} />
                        </View>
                    </View>

                </ScrollView>


            </View>
        </GestureHandlerRootView>
    )
}

export default BrandSingle;