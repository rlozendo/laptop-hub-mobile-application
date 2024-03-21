/**
 * THIS WILL SHOW THE BRANDS OF OUR LAPTOPS
 * EG: ASUS, MAC PRO, ACER, MSI AND MORE
 */

// IMPORT ALL WE NEED
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, View, TextInput, Text, Alert, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { onValue, ref } from 'firebase/database';
import Header from '../partials/Header';
import Footer from '../partials/Footer';

import Styles from '../Styles';

const Brands = (props) => {

    // DECLARE VARIABLES
    const { route } = props;
    const { userId } = route.params;
    console.log(userId)
    const navigation = useNavigation();
    const [avatar, setAvatar] = useState('');

    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    // FETCH DATA OF OUR LAPTOPS FROM EXTERNAL WEBSITE, THAT WE CREATED
    // THIS IS OUR BACKEND FOR OUR BILAPTOPSKES
    // IT IS A WORDPRESS SITE, FROM THERE WE CAN ADD, EDIT, DELETE PRODUCTS/LAPTOPS
    // https://2fxmedia.net/mobapp/wp-json/wp/v2/products_brand?per_page=4&page=1
    const fetchData = async (pageNumber) => {
        try {
            setLoading(true);
            const response = await fetch(`https://2fxmedia.net/laptophub/wp-json/wp/v2/products_brand?per_page=4&page=${pageNumber}&hide_empty=true`);
            const result = await response.json();
            setData([...data, ...result]);
            const totalPagesHeader = response.headers.get('X-WP-TotalPages');
            setTotalPages(totalPagesHeader);
            console.log('Total Pages:', totalPagesHeader);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // TO LOAD MORE DATA, IF THE BUTTON WAS CLICKED IT WILL LOAD MORE DATA FROM THE WP SITE, IT WILL LOAD MORE PRODUCTS
    const handleLoadMore = () => {
        const nextPage = page + 1;
        fetchData(nextPage);
        setPage(nextPage);
    };

    useEffect(() => {
        const dataRef = ref(db, `users/${userId}`);
        onValue(dataRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.information && userData.information.imageUrl) {
                setAvatar(userData.information.imageUrl);
            }

        });
    }, [userId]);

    const Logout = () => {
        signOut(auth)
            .then(() => {
                props.navigation.navigate('Login');
            })
            .catch((error) => {
                console.error('Error while logging out:', error);
                Alert.alert('An error occurred while logging out.');
            });
    };

    useEffect(() => {
        fetchData(page);
    }, [page, userId]);

    return (
        <GestureHandlerRootView>
            <View style={Styles.scrollView1}>
                {/* HEADER START */}
                <Header userId={userId} />
                {/* FOOTER START */}
                <Footer userId={userId} />
                <ScrollView>
                    <View style={Styles.container}>
                        <View style={{ flex: 1 }}>
                            <Text style={[Styles.brandsHeader]}>Presenting an extensive array of premier laptop brands, here is a comprehensive list of the distinguished names we proudly carry in our inventory. Dive into the world of cutting-edge technology and explore the options available from renowned brands that define excellence in the realm of laptops.</Text>
                            {data.map(item => (
                                <View key={item.id} style={[Styles.brandWrapper]}>
                                    {
                                        // ON THIS AREA, IF THE PRODUCT/LAPTOP WAS CLICKED IT WILL GO TO ANOTHER PAGE,
                                        // THIS IS WE CALLED, SINGLE PRODUCT.. IT WILL PASS DATA SO THAT WE CAN SHOW THE DATA OF THE LAPTOP THAT WAS CLICKED
                                    }
                                    <TouchableHighlight
                                        onPress={() => navigation.replace('BrandSingle', { userId, brandId: item.id, title: item.name, base: 'sa meron' })}
                                        underlayColor="transparent"
                                    >
                                        <View>
                                            {
                                                item.brand_logo_url && (
                                                    <View style={Styles.fgdgd}>
                                                        <Image source={{ uri: item.brand_logo_url }} style={[Styles.imageBike, { padding: 10 }]} />
                                                    </View>
                                                )
                                            }
                                            <Text style={[Styles.brandName]}>{item.name}</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            ))}
                            {loading && (
                                <View>
                                    <ActivityIndicator style={Styles.spinnerContainer} size="large" color="#50d9ce" />
                                </View>
                            )}
                            {page < totalPages && !loading && (
                                <TouchableHighlight style={[Styles.buttonDash, Styles.buttonDash2]} onPress={handleLoadMore}>
                                    <Text style={Styles.txtBtn}>Load More</Text>
                                </TouchableHighlight>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    )
}
export default Brands;