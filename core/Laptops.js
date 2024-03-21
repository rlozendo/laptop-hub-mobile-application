/**
 * THIS WILL FETCH DATA FROM A WORDPRSES SITE THRU RESTFUL API
 * IT WIL GATHER ALL THE DATA THAT WE NEED TO SHOW OUR LAPTOPS
 * AND IF A PRODUCT WAS CLICKED, IT WILL GO TO ANOTHER PAGE TO SHOW FULL INFORMATION OF THE PRODUCT
 * 
 */

// IMPROT WHAT WE NEED
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableHighlight, Image, ActivityIndicator } from 'react-native';
import { db } from './firebaseConfig';
import { onValue, ref } from 'firebase/database';
import HTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';


import Styles from './Styles';

const Laptops = (props) => {
    // DECLARE VARIABLES
    const { userId, brandId } = props;
    const navigation = useNavigation();
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    // FETCH DATA OF OUR LAPTOPS FROM EXTERNAL WEBSITE, THAT WE CREATED
    // THIS IS OUR BACKEND FOR OUR LAPTOPS
    // IT IS A WORDPRESS SITE, FROM THERE WE CAN ADD, EDIT, DELETE PRODUCTS/LAPTOPS
    // https://2fxmedia.net/mobapp/wp-json/wp/v2/products?per_page=3&page=1
    const fetchData = async (pageNumber, categoryId) => {
        let catIdParameter = categoryId ? `&products_brand=${categoryId}` : '';
        try {
            setLoading(true);
            const response = await fetch(`https://2fxmedia.net/laptophub/wp-json/wp/v2/products?per_page=3&page=${pageNumber}${catIdParameter}`);
            const result = await response.json();
            setData([...data, ...result]);
            const totalPagesHeader = response.headers.get('X-WP-TotalPages');
            setTotalPages(totalPagesHeader);
            console.log('Total Pages:', totalPagesHeader);
            console.log(`https://2fxmedia.net/laptophub/wp-json/wp/v2/products?per_page=3&page=${pageNumber}${catIdParameter}`);
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

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');

    useEffect(() => {
        fetchData(page, brandId);
        const dataRef = ref(db, `users/${userId}`);
        onValue(dataRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.email) {
                setEmail(userData.email);
            }
            if (userData && userData.firstName) {
                setFirstName(userData.firstName);
            }
            if (userData && userData.lastName) {
                setLastName(userData.lastName);
            }
            if (userData && userData.information.phoneNo) {
                setPhoneNo(userData.information.phoneNo);
            }
        });

    }, [page, userId]);

    return (
        <ScrollView>
            <View style={{ flex: 1 }}>
                {brandId ? (
                    <Text style={Styles.bikeHeader}>xxOur most recent inventory</Text>
                ) : (
                    <Text style={Styles.bikeHeader}>Our most recent inventory</Text>
                )}

                {data.map(item => (
                    <View key={item.id} style={Styles.productWrapper}>

                        {
                            // ON THIS AREA, IF THE PRODUCT/BIKE WAS CLICKED IT WILL GO TO ANOTHER PAGE, 
                            // THIS IS WE CALLED, SINGLE PRODUCT.. IT WILL PASS DATA SO THAT WE CAN SHOW THE DATA OF THE  BIKE THAT WAS CLICKED                        
                        }
                        <TouchableHighlight
                            onPress={() => navigation.replace('SingleProduct', { userId, productId: item.id, email, firstName, lastName, phoneNo })}
                            underlayColor="transparent"
                        >
                            <View>

                                <View style={Styles.productImgHolder}>
                                    {item.featured_image ? (
                                        <Image source={{ uri: item.featured_image.latop_image_size[0] }} style={[Styles.imageBike, { padding: 10 }]} />
                                    ) : (
                                        <Image style={Styles.headerLogo} source={require('../assets/placeholder-img.png')} style={[Styles.imageBike, { padding: 10 }]} />
                                    )}
                                </View>




                                <Text style={Styles.productName}>{item.title.rendered}</Text>
                                <Text style={Styles.productCategory}>{item.products_brand[0].name}</Text>

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
        </ScrollView >
    );
};

export default Laptops;
