/**
 * DASHBOARD / HOME
 * THIS WILL BE THE MAIN SCREEN AFTER THE USER LOGGED IN
 * FOR THE USER THAT IS LOGGING IN FOR THE FIRST TIME
 * THE APP WILL GOING TO SHOW A FORM THAT THE USER NEEDS TO FILL OUT
 * AND THEN SAVE IT, THE FIELDS MUST NOT BE EMPTY
 * ON SAVE THE EDIT FIELD WILL BE FALSE
 * THEN ON SAVE IT WILL SAVE THE NEW FIELDS INTO REALTME DATABASE
 * AFTER SAVING, THE SCREEN WILL AUTOMATICALLY SHOW THE LAPTOP PRODUCTS.. THAT IS THE <LAPTOPS /> LAPTOPS.JS
 * THE DATA OF THE LAPTOPS ARE COMING FROM ANOTHER SITE, IT IS A WP SITE, BY THE USE OF RESTFUL API WE CONNECT AND GET ALL THE DATA WE NEED
 * WE ALSO USED THE FIREBASE STORAGE, WERE WE SAVE THE IMAGES/AVATAR
 */

// IMPORT ALL WE NEED
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, View, TextInput, Text, Alert, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { db, auth, storage } from '../firebaseConfig';
import { onValue, ref, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as sRef } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import Laptops from '../Laptops';

import Styles from '../Styles';

// THIS IS THE DASBOARD SCREEN
const Dashboard = (props) => {
    // DECLARE THE VARIABLES
    const { route } = props;
    const { userId } = route.params;
    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        edit: false,
        information: {
            streetHomeNo: '',
            city: '',
            zipcode: '',
            country: '',
            age: '',
            birthDay: '',
            phoneNo: '',
            imageUrl: ''
        },
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [imageUrl, setImageUrl] = useState('');

    // THIS WILL HANDLE IF THERE IS ERROR ON THE FORM (FOR FIRST TIME LOGGED IN USERS)
    const validateForm = () => {
        const errors = {};

        // Check each required field and add an error if empty
        if (!userProfile.information?.age) {
            errors.age = 'Age is required';
        }
        if (!userProfile.information?.birthDay) {
            errors.birthDay = 'BirthDay is required';
        }
        if (!userProfile.information?.city) {
            errors.city = 'City is required';
        }
        if (!userProfile.information?.country) {
            errors.country = 'Country is required';
        }
        if (!selectedImage) {
            errors.imageUrl = 'Image is required';
        }
        if (!userProfile.information?.phoneNo) {
            errors.phoneNo = 'Phone No. is required';
        }
        if (!userProfile.information?.streetHomeNo) {
            errors.streetHomeNo = 'Street & Home No. is required';
        }
        if (!userProfile.information?.zipcode) {
            errors.zipcode = 'Zipcode is required';
        }

        // Set the errors in the state
        setFieldErrors(errors);

        // Check if there are any errors
        return Object.keys(errors).length === 0;
    };

    // CONNECT TO REALTIME DATABASE, AND GET USER DATA
    useEffect(() => {
        const userRef = ref(db, '/users/' + userId);
        try {
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserProfile(userData);
                    const timeout = setTimeout(() => {
                        setLoading(false);
                    }, 2000);

                    return () => clearTimeout(timeout);
                } else {
                    setLoading(false);
                    Alert.alert('User data not found in Realtime Database.');
                }
            });
        } catch (error) {
            setLoading(false);
            console.error('Error fetching user data:', error);
            Alert.alert('An error occurred while fetching user data.');
        }
    }, [userId]);

    // CONNECT AGAIN AND GET SOME DATA AVATAR (THIS IS FOR THE SCREEN WITH PRODUCTS)
    useEffect(() => {
        const dataRef = ref(db, `users/${userId}`);
        onValue(dataRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.information && userData.information.imageUrl) {
                setImageUrl(userData.information.imageUrl);
            }

        });
    }, [userId]);

    // FUNCTON THAT WILL HANDLE THE FIELDS OF THE FORM(FOR THE FIRST TIME LOGGED IN USER)
    const handleInputChange = (field, value) => {
        setUserProfile((prevProfile) => {
            if (field === 'edit' || field === 'imageUrl' || field === 'email') {
                return {
                    ...prevProfile,
                    [field]: value,
                };
            } else {
                return {
                    ...prevProfile,
                    information: {
                        ...prevProfile.information,
                        [field]: value,
                    },
                };
            }
        });
    };

    // THIS WILL HANDLE THE IMAGE PICKER OF THE APP
    const handleImagePicker = async () => {
        const { status, assets } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission to access media library was denied');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    // THIS WILL HANDLE THE CAMERA OF THE APP
    const handleCameraCapture = async () => {
        const { status, assets } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission to access camera was denied');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    // THIS WILL HANDLE TO SAVE THE INFORMATION FROM THE USER AND THE IMAGE AS WELL
    const handleImageUploadAndSave = async () => {
        const isValid = validateForm();
        if (!isValid) {
            return; // Display errors and return if the form is not valid
        }

        try {
            setSaving(true);

            let setImageUrl = '';

            if (selectedImage) {
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                const storage = getStorage();
                const storageRef = sRef(storage, 'images/' + userId + '/' + new Date().toISOString());
                const snapshot = await uploadBytes(storageRef, blob);
                setImageUrl = await getDownloadURL(snapshot.ref);
            }

            const userRef = ref(db, `/users/${userId}`);
            const userData = {
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                email: userProfile.email,
                edit: false,
                information: {
                    streetHomeNo: userProfile.information?.streetHomeNo || '',
                    city: userProfile.information?.city || '',
                    zipcode: userProfile.information?.zipcode || '',
                    country: userProfile.information?.country || '',
                    age: userProfile.information?.age || '',
                    birthDay: userProfile.information?.birthDay || '',
                    phoneNo: userProfile.information?.phoneNo || '',
                    imageUrl: setImageUrl,
                },
            };

            await set(userRef, userData);
            Alert.alert('Data saved successfully', '', [{
                text: 'OK',
                onPress: () => {
                    setSaving(false);
                    //props.navigation.replace('Dashboard', { userId });
                },
            },
            ]);
        } catch (error) {
            console.error('Error during image upload or saving data:', error);
            Alert.alert('An error occurred while processing the data.');
            setSaving(false);
        }
    };

    // LOGOUT FUNCTION
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

    // JUST AN OPTION TO HIDE THE BACK BUTTON AT THE HEADER AREA, SO THAT IT WILL BE LESS ISSUE
    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => false,
        });
    }, [props.navigation]);

    return (
        <View style={Styles.scrollView1}>

            {/* HEADER START */}
            <Header userId={userId} />

            {/* FOOTER START */}
            <Footer userId={userId} />

            <ScrollView>
                <View style={Styles.container}>

                    <Text style={{ display: 'none' }} >User ID: {userId}</Text>


                    {userProfile.edit ? (
                        <>
                            <Text style={Styles.para2}>Hi {userProfile.firstName} {userProfile.lastName}, Please fill up the fields below to continue the registration.</Text>
                        </>
                    ) : (
                        <>

                            <Text style={Styles.para2}>Hi {userProfile.firstName} {userProfile.lastName}, Thank you for utilizing our mobile app. Here, you can select the laptops you wish to procure—note that our offerings are exclusively wholesale setup.</Text>
                        </>
                    )}

                    {loading ? (

                        <View style={Styles.spinnerContainer}>
                            <ActivityIndicator size="large" color="#6ed2c8" />
                        </View>

                    ) : userProfile.edit ? (

                        <View>
                            {/* HIDDEN ELEMENT DONT REMOVE IT, IMPORTANT FOR DB FirstName */}
                            <TextInput
                                style={{ display: 'none' }}
                                placeholder="First Name"
                                value={userProfile.firstName}
                                onChangeText={(text) => handleInputChange('firstName', text)}
                            />

                            {/* HIDDEN ELEMENT DONT REMOVE IT, IMPORTANT FOR DB LastName */}
                            <TextInput
                                style={{ display: 'none' }}
                                placeholder="Last Name"
                                value={userProfile.lastName}
                                onChangeText={(text) => handleInputChange('lastName', text)}
                            />

                            {/* AGE */}
                            <TextInput
                                style={Styles.inputUser2}
                                placeholder="Age"
                                value={userProfile.information ? userProfile.information.age : null}
                                onChangeText={(text) => handleInputChange('age', text)}
                            />
                            <Text style={Styles.errorText}>{fieldErrors.age}</Text>

                            {/* BIRTHDAY */}
                            <TextInput
                                style={Styles.inputUser2}
                                placeholder="Birthday - January 01, 2000"
                                value={userProfile.information ? userProfile.information.birthDay : null}
                                onChangeText={(text) => handleInputChange('birthDay', text)}
                            />
                            <Text style={Styles.errorText}>{fieldErrors.birthDay}</Text>

                            {/* PHONE NO */}
                            <TextInput
                                style={Styles.inputUser2}
                                placeholder="Phone No."
                                value={userProfile.information ? userProfile.information.phoneNo : null}
                                onChangeText={(text) => handleInputChange('phoneNo', text)}
                            />
                            <Text style={Styles.errorText}>{fieldErrors.phoneNo}</Text>

                            <Text style={Styles.fieldHeding}>Address:</Text>
                            {/* COUNTRY */}
                            <TextInput
                                style={[Styles.inputUser2, Styles.mt0]}
                                placeholder="Country"
                                value={userProfile.information ? userProfile.information.country : null}
                                onChangeText={(text) => handleInputChange('country', text)}
                            />
                            <Text style={Styles.errorText}>{fieldErrors.country}</Text>

                            {/* CITY */}
                            <TextInput
                                style={Styles.inputUser2}
                                placeholder="City"
                                value={userProfile.information ? userProfile.information.city : null}
                                onChangeText={(text) => handleInputChange('city', text)}
                            />
                            <Text style={Styles.errorText}>{fieldErrors.city}</Text>

                            {/* STREET & HOME NO. */}
                            <TextInput
                                style={Styles.inputUser2}
                                placeholder="Street & Home No"
                                value={userProfile.information ? userProfile.information.streetHomeNo : null}
                                onChangeText={(text) => handleInputChange('streetHomeNo', text)}
                            />
                            <Text style={Styles.errorText}>{fieldErrors.streetHomeNo}</Text>

                            {/* ZIPCODE */}
                            <TextInput
                                style={Styles.inputUser2}
                                placeholder="Zipcode"
                                value={userProfile.information ? userProfile.information.zipcode : null}
                                onChangeText={(text) => handleInputChange('zipcode', text)}
                            />
                            <Text style={Styles.errorText}>{fieldErrors.zipcode}</Text>

                            {/* EMAIL HIDDENT ELEMENT WE JUST NEED THAT FOR A RECORD IN DB */}
                            <TextInput
                                style={{ display: 'none' }}
                                placeholder="Email"
                                value={userProfile.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                            />


                            {/* IMAGE AREA */}
                            {selectedImage && (
                                <View>
                                    <Image
                                        source={{ uri: selectedImage }}
                                        style={Styles.dummyImg}
                                    />
                                </View>
                            )}
                            <Text style={[Styles.errorText, Styles.spaceTop]}>{fieldErrors.imageUrl}</Text>

                            <View style={Styles.flex2}>
                                <View style={Styles.viewLogin3}>
                                    {/* SELECT IMAGE THRU PHOTO GALLERY */}
                                    <TouchableHighlight

                                        style={Styles.leftBtn}
                                        onPress={handleImagePicker}
                                        disabled={saving}
                                    >
                                        <Text style={Styles.txtBtn}>Select Image</Text>
                                    </TouchableHighlight>


                                    {/* USING CAMERA TO CAPTURE PHOTO/IMAGE */}
                                    <TouchableHighlight

                                        style={Styles.rightBtn}
                                        onPress={handleCameraCapture}
                                        disabled={saving}
                                    >
                                        <Text style={Styles.txtBtn}>Capture Image</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>



                            {/* BUTTON TO SUBMIT DATA TO REALTIME DB */}
                            <TouchableHighlight
                                style={Styles.blockBtn}
                                onPress={handleImageUploadAndSave}
                                disabled={saving}
                            >
                                <Text style={Styles.txtBtn}>Submit</Text>
                            </TouchableHighlight>

                            {/* ACTIVITY INDICATOR WHILE SAVING DATA */}
                            {saving && (
                                <View style={Styles.spinnerContainer}>
                                    <ActivityIndicator size="large" color="#6ed2c8" />
                                </View>
                            )}
                        </View>
                    ) : (
                        <View>
                            <Laptops userId={userId} />
                        </View>
                    )}

                </View>
            </ScrollView>
        </View>
    );
};

export default Dashboard;
