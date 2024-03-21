/**
 * THIS WILL GOIGN TO HANDLE THE SINGLE PRODUCT
 * FROM <LAPTOPS /> TO SINGLEPRODUCT, WE WILL SHOW FULL DATA OF A SINGLE LAPTOP
 * WE USED FETCH TO GET THE DATA FROM WORDPRESS SITE
 * WE ALSO USED A FORM SO THAT THE USER WILL INQUIRE BY PRODUTS..
 * THE ID, NAME OF THE PRODUCT ARE AUTOMATICALLY INCLUDED IN THE EMAIL
 * THE USERS INFO AS WELL
 */

// IMPORT EVERYTHIGN WE NEED
import React, { useState, useEffect } from 'react';
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

import Styles from '../Styles';

const SingleProduct = (props) => {
    // DECLARE VARIABLES
    const route = useRoute();
    const { userId, productId, email, firstName, lastName, phoneNo } = route.params;
    const navigation = useNavigation();
    const [currentPage, setCurrentPage] = useState(0);
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState('');
    const [emailMessage, setEmailMessage] = useState('');

    //ERROR MESSAGES
    const [messageError, setMessageError] = useState(null);
    const [quantityError, setQuantityError] = useState(null);
    const [sizesError, setSizesError] = useState(null);
    const [addressError, setAddressError] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [sender, setSender] = useState(true);
    const [theProductTitle, setTheProductTitle] = useState('');
    const onMessageChangeHandler = (value) => {
        setEmailMessage(value);
        setMessageError('');
    };
    const [minimumQuantity, setMinimumQuantity] = useState('');
    const [quantity, setQuantity] = useState('');
    const [sizesPh, setSizesPh] = useState('');
    const [sizes, setSizes] = useState('');
    const [address, setAddress] = useState('');
    // ON THIS AREA WE WILL FETCH THE DATA THAT WAS CLICKED FORM <LAPTOPS />
    // WE WILL USE FETCH TO FETCH THE DATA OF THE LAPTOP TO SHOW DATA
    // https://2fxmedia.net/mobapp/wp-json/wp/v2/products/63
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`https://2fxmedia.net/laptophub/wp-json/wp/v2/products/${productId}`);
                const product = await response.json();
                product.title.rendered = he.decode(product.title.rendered);
                setTheProductTitle(he.decode(product.title.rendered));
                setMinimumQuantity(product.acf.minimum_order);
                setSizesPh(product.acf.sizes);
                setProductData(product);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product data:', error);
                setLoading(true);
            }
        };
        fetchProductData();

        const dataRef = ref(db, `users/${userId}`);
        onValue(dataRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.information && userData.information.imageUrl) {
                setAvatar(userData.information.imageUrl);
            }

        });
    }, [productId, userId]);

    // SET THE HEADER NAV TO FALSE
    useEffect(() => {
        // Set up navigation options
        navigation.setOptions({
            title: productData ? productData.title.rendered : 'Product Detail',
            headerLeft: () => false
        });
    }, [navigation, userId, productData]);

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

    // PRELOADER OF ACTIVITY INDICATOR
    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#50d9ce" />
            </View>
        );
    }

    // VALIDATE FIELDS OF THE EMAIL FORM
    const validateInput = () => {
        let isValid = true;

        // Validate message
        if (emailMessage.trim() === '') {
            setMessageError('Message cannot be empty');
            isValid = false;
        } else {
            setMessageError('')
        }

        //Quantity
        if (quantity.trim() === '' || parseInt(quantity.trim(), 10) < parseInt(minimumQuantity, 10)) {
            setQuantityError(`Quantity cannot be empty or less than the minimum order quantitybe empty ${minimumQuantity}`)
            isValid = false;
        } else {
            setQuantityError(null);

        }

        const sizesString = sizesPh;
        // Duplicate the value and the duplicated is in smallcaps mode
        const duplicatedSizesString = sizesString + ', ' + sizesString.toLowerCase();
        const sizesArray = duplicatedSizesString.split(',').map(size => size.trim());
        console.log(sizesArray)
        //Sizes, sizesArray.includes(sizes.trim()) checks if sizes.trim() is present in the sizesArray. If it is, an error is set; otherwise, the error is cleared.
        if (sizes.trim() === '' || !sizesArray.includes(sizes.trim())) {
            setSizesError(`Sizes cannot be empty or the value of sizes must be ${sizesString}`)
            isValid = false;
        } else {
            setSizesError(null)
        }

        //Quantity
        if (quantity.trim() === '' || parseInt(quantity.trim(), 10) < parseInt(minimumQuantity, 10)) {
            setQuantityError(`Quantity cannot be empty or less than the minimum order quantitybe empty ${minimumQuantity}`)
            isValid = false;
        } else {
            setQuantityError(null);

        }

        if (address.trim() === '') {
            setAddressError('Warehouse Address cannot be empty')
            isValid = false;
        } else {
            setAddressError(null);
        }





        return isValid;
    };

    // THIS WILL SEND A MESSAGE TO THE SALES OF CYCLEHUB
    const sendMessage = async () => {
        if (!validateInput()) {
            return;
        }

        setIsLoading(true);

        const isEmailAvailable = await MailComposer.isAvailableAsync();
        console.log(isEmailAvailable);
        if (isEmailAvailable) {
            Alert.alert('Double check everythign and send');
            const subject = productId + ' - ' + theProductTitle;
            if (sender) {
                console.log(sender)
                let options = {
                    recipients: ['melster@2fxmedia.net'],
                    ccRecipients: [email],
                    subject: subject,
                    body: `Quantity: ${quantity} <br>Size: ${sizes}<br>Warehouse address: ${address}<br>Messaeg/Instructions:<br>${emailMessage}<br><br>usercide: ${userId}<br>Full name: ${firstName} ${lastName}<br>Contat No.:${phoneNo}`,
                    isHtml: true,
                };
                MailComposer.composeAsync(options)
                    .then((result) => {
                        Alert.alert(`Status: ${result.status}! Thank you for contacting us, we will contact you as soon as possible.`);
                    })
                    .finally(() => {
                        setIsLoading(false);
                        setEmailMessage('');
                    });
            } else {
                Alert.alert(`Sender: ${sender}`);
                setIsLoading(false);
            }
        } else {
            if (sender) {
                Alert.alert('I apologize, but the mail functionality you intended to use is not currently accessible.');
                setIsLoading(false);
            } else {
                Alert.alert('I regret to inform you that the SMS functionality you were looking to utilize is presently unavailable.');
                setIsLoading(false);
            }
        }
    };

    return (
        <GestureHandlerRootView>
            <View style={Styles.scrollView1}>

                {/* HEADER START */}
                <Header userId={userId} />

                {/* FOOTER START */}
                <Footer userId={userId} />

                <ScrollView>
                    <View style={Styles.container}>
                        <Text style={{ display: 'none' }}>{userId} {productId}</Text>
                        {productData && (
                            <View>
                                <Text style={Styles.productTitle}>{productData.title.rendered}</Text>
                                <Text style={Styles.galleryTitle}>Image Gallery (swipe to slide)</Text>
                                <View style={Styles.sliderWrapper}>
                                    <PagerView
                                        style={{ height: 300 }}
                                        initialPage={currentPage}
                                        onPageSelected={(event) => setCurrentPage(event.nativeEvent.position)}
                                    >
                                        {productData.gallery &&
                                            productData.gallery.map((url, index) => (
                                                <View key={index}>
                                                    <Image
                                                        source={{ uri: url.id.url }}
                                                        style={[Styles.imageBike]}
                                                    />
                                                </View>
                                            ))
                                        }
                                    </PagerView>
                                </View>
                                {/* Display other fields */}
                                <View style={Styles.infoWrapper}>
                                    <Text style={Styles.heading}>Description:</Text>
                                    <Text style={Styles.subHeading}>{productData.acf.description}</Text>
                                </View>
                                <View style={Styles.infoWrapper}>
                                    <Text style={Styles.heading}>Features:</Text>
                                    {productData.acf.features &&
                                        productData.acf.features.map((feature, index) => (
                                            <View key={index}>
                                                <Text style={Styles.subHeading}>{he.decode(feature.feature)}</Text>
                                            </View>
                                        )
                                        )}
                                </View>
                                <View style={Styles.infoWrapper}>
                                    <Text style={Styles.heading}>Specifications:</Text>
                                    {productData.acf.specifications &&
                                        productData.acf.specifications.map((spec, index) => (
                                            <View key={index}>
                                                <Text style={[Styles.subHeading, Styles.subHeading2]}>{he.decode(spec.label)}</Text>
                                                <Text style={Styles.subHeading}>{he.decode(spec.specification)}</Text>
                                            </View>
                                        )
                                        )}
                                </View>
                                <View style={Styles.infoWrapper}>
                                    <Text style={Styles.heading}>Sizes:</Text>
                                    <Text style={Styles.subHeading}>{productData.acf.sizes}</Text>
                                </View>
                                <View style={Styles.infoWrapper}>
                                    <Text style={Styles.heading}>Whole Sale Price:</Text>
                                    <Text style={Styles.subHeading}>{productData.acf.whole_sale_price}</Text>
                                </View>
                                <View style={Styles.infoWrapper}>
                                    <Text style={Styles.heading}>Minimum Order:</Text>
                                    <Text style={Styles.subHeading}>{productData.acf.minimum_order} {minimumQuantity}</Text>
                                </View>
                            </View>
                        )}
                        <View>
                            <Text style={[Styles.boldThis, Styles.boldThisHelper]}>To place an order for this product, please utilize the form provided below.</Text>
                            <TextInput
                                style={[Styles.inputUser, Styles.inputUserHelper, Styles.inputUserHelper2]}
                                onChangeText={(value) => setQuantity(value)}
                                autoCapitalize='words'
                                autoCorrect={false}
                                placeholder={`Quantity (minimum order is ${minimumQuantity})`}
                                value={quantity}
                                editable={!loading} // Disable when loading
                                keyboardType="numeric"
                            />
                            {quantityError && (
                                <>
                                    <Text style={Styles.errorText}>{quantityError}</Text>
                                </>
                            )}
                            <TextInput
                                style={[Styles.inputUser, Styles.inputUserHelper]}
                                onChangeText={(value) => setSizes(value)}
                                autoCapitalize='words'
                                autoCorrect={false}
                                placeholder={`Sizes: ${sizesPh}`}
                                value={sizes}
                                editable={!loading} // Disable when loading
                            />
                            {sizesError && (
                                <>
                                    <Text style={Styles.errorText}>{sizesError}</Text>
                                </>
                            )}
                            <TextInput
                                style={[Styles.inputUser, Styles.inputUserHelper]}
                                onChangeText={(value) => setAddress(value)}
                                autoCapitalize='words'
                                autoCorrect={false}
                                placeholder='Warehouse Address'
                                value={address}
                                editable={!loading} // Disable when loading
                            />
                            {addressError && (
                                <>
                                    <Text style={Styles.errorText}>{addressError}</Text>
                                </>
                            )}
                            <TextInput
                                style={[Styles.contactTextarea, Styles.inputUserHelper]}
                                multiline
                                numberOfLines={3}
                                placeholder="Please enter your inquiry.."
                                onChangeText={onMessageChangeHandler}
                                value={emailMessage}
                            />
                            <Text style={Styles.errorText}>{messageError}</Text>
                            <TouchableHighlight style={[Styles.buttonDash, Styles.mt5]} onPress={sendMessage}>
                                <Text style={Styles.txtBtn}>Submit</Text>
                            </TouchableHighlight>
                            {isLoading && (
                                <View style={Styles.spinnerContainer}>
                                    <ActivityIndicator size="large" color="#6ed2c8" />
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
};

export default SingleProduct;
