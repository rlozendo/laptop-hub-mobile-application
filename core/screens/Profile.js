/**
 * THIS SCREEN IS FOR THE PROFILE, WERE THE USER ACCOUNT CAN ALTER OR EDIT THEIR USER INFO.
 * OF COURSE JUST LIKE THE OTHERS, IT WILL GOING TO CONNECT TO THE REALTIME DATABASE  TO SAVE DATA
 * 
 */

// IMOPORT EVERYTHIGN WE NEED
import React, { useState, useEffect } from 'react';
import { ScrollView, View, TextInput, Text, Alert, Image, TouchableHighlight } from 'react-native';
import { ref, onValue, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { signOut } from 'firebase/auth';
import { db, auth, storage } from '../firebaseConfig';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as sRef } from 'firebase/storage';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import Styles from '../Styles';

// Define the Profile component
const Profile = (props) => {
    // DECLARE VARIABLES
    const { route } = props;
    const { userId } = route.params;
    const navigation = useNavigation();
    const [errors, setErrors] = useState({});

    // For fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAdd, setEmailAdd] = useState('');
    const [country, setCountry] = useState('');
    const [streetHomeNo, setStreetHomeNo] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [age, setAge] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [avatar, setAvatar] = useState('');
    const [imageKey, setImageKey] = useState(0);

    // FUNCTION TO HANDLE IMAGE GALLERY
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
            setImageUrl(result.assets[0].uri);
        }
    };

    // FUNCTION TO HANDLE CAMERA
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
            setImageUrl(result.assets[0].uri);
        }
    };

    // FUNCTION TO HANDLE ERRORS OF THE FORM
    const handleImageUploadAndSave = async () => {

        const fieldErrors = {};

        //Check if there's an error
        if (!firstName.trim()) {
            fieldErrors.firstName = 'First Name is required';
        }
        if (!lastName.trim()) {
            fieldErrors.lastName = 'Last Name is required';
        }
        if (!country.trim()) {
            fieldErrors.country = 'Country is required';
        }

        if (!streetHomeNo.trim()) {
            fieldErrors.streetHomeNo = 'Street and No. is required';
        }

        if (!city.trim()) {
            fieldErrors.city = 'City is required';
        }

        if (!zipcode.trim()) {
            fieldErrors.zipcode = 'Zipcode is required';
        }

        if (!age.trim()) {
            fieldErrors.age = 'Age is required';
        }

        if (!birthDay.trim()) {
            fieldErrors.birthDay = 'Birthday is required';
        }

        if (!phoneNo.trim()) {
            fieldErrors.phoneNo = 'Phone No. is required';
        }

        setErrors(fieldErrors);

        if (Object.keys(fieldErrors).length > 0) {
            Alert.alert('There are some issues that you need to fix.')
            return;

        }

        // UPLOAD IMAGE TO FIRESTORAGE
        const storageRef = sRef(storage, `users/${userId}/profile-image`);
        const blob = await fetch(imageUrl).then((res) => res.blob());
        await uploadBytes(storageRef, blob);

        // GET URL OF THE IMAGE UPLOADED
        const downloadUrl = await getDownloadURL(storageRef);
        setAvatar(downloadUrl);

        // SAVE INFORMATION TO DATABASE
        const userRef = ref(db, `users/${userId}`);
        await set(userRef, {
            firstName,
            lastName,
            email: emailAdd,
            edit: false,
            information: {
                age,
                birthDay,
                city,
                country,
                imageUrl: downloadUrl, // Updated image URL
                phoneNo,
                streetHomeNo,
                zipcode,
            }
        });

        // Display success message
        Alert.alert('Profile updated successfully!');
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

    // useEffect hook to fetch user data on component mount
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => false,
        });
        console.log(errors)
        setErrors(currentErrors => ({}));

        const userRef = ref(db, `users/${userId}`);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.firstName) {
                setFirstName(userData.firstName);
            }
            if (userData && userData.lastName) {
                setLastName(userData.lastName);
            }
            if (userData && userData.email) {
                setEmailAdd(userData.email);
            }
            if (userData && userData.information && userData.information.age) {
                setAge(userData.information.age);
            }
            if (userData && userData.information && userData.information.birthDay) {
                setBirthDay(userData.information.birthDay);
            }
            if (userData && userData.information && userData.information.city) {
                setCity(userData.information.city);
            }
            if (userData && userData.information && userData.information.country) {
                setCountry(userData.information.country);
            }
            if (userData && userData.information && userData.information.imageUrl) {
                setImageUrl(userData.information.imageUrl);
                setAvatar(userData.information.imageUrl);
            }
            if (userData && userData.information && userData.information.phoneNo) {
                setPhoneNo(userData.information.phoneNo);
            }
            if (userData && userData.information && userData.information.streetHomeNo) {
                setStreetHomeNo(userData.information.streetHomeNo);
            }
            if (userData && userData.information && userData.information.zipcode) {
                setZipcode(userData.information.zipcode);
            }
        });

    }, [navigation, userId]);

    // Return the JSX content of the component
    return (
        <GestureHandlerRootView>
            <View style={Styles.scrollView1}>
                {/* HEADER START */}
                <Header userId={userId} />

                {/* FOOTER START */}
                <Footer userId={userId} />

                <ScrollView>
                    <View style={Styles.container}>
                        <View>
                            {/* Hidden user ID */}
                            <Text style={{ display: 'none' }}>{userId}</Text>

                            {/* Input fields for user information */}
                            <TextInput
                                style={[Styles.inputUser2]}
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={(text) => setFirstName(text)}
                            />
                            {errors.firstName && <Text style={Styles.errorText}>{errors.firstName}</Text>}

                            <TextInput
                                style={[Styles.inputUser2, , Styles.mt8]}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={(text) => setLastName(text)}
                            />
                            {errors.lastName && <Text style={Styles.errorText}>{errors.lastName}</Text>}

                            <TextInput
                                style={[Styles.inputUser2, , Styles.mt8]}
                                placeholder="Age"
                                value={age}
                                onChangeText={(text) => setAge(text)}
                            />
                            {errors.age && <Text style={Styles.errorText}>{errors.age}</Text>}

                            <TextInput
                                style={[Styles.inputUser2, , Styles.mt8]}
                                placeholder="Birthday"
                                value={birthDay}
                                onChangeText={(text) => setBirthDay(text)}
                            />
                            {errors.birthDay && <Text style={Styles.errorText}>{errors.birthDay}</Text>}

                            <TextInput
                                style={[Styles.inputUser2, , Styles.mt8]}
                                placeholder="Phone No."
                                value={phoneNo}
                                onChangeText={(text) => setPhoneNo(text)}
                            />
                            {errors.phoneNo && <Text style={Styles.errorText}>{errors.phoneNo}</Text>}

                            <Text style={Styles.fieldHeding}>Address:</Text>
                            <TextInput
                                style={[Styles.inputUser2, Styles.mt0]}
                                placeholder="Country"
                                value={country}
                                onChangeText={(text) => setCountry(text)}
                            />
                            {errors.country && <Text style={Styles.errorText}>{errors.country}</Text>}

                            <TextInput
                                style={[Styles.inputUser2, , Styles.mt8]}
                                placeholder="City"
                                value={city}
                                onChangeText={(text) => setCity(text)}
                            />
                            {errors.city && <Text style={Styles.errorText}>{errors.city}</Text>}

                            <TextInput
                                style={[Styles.inputUser2, , Styles.mt8]}
                                placeholder="Street, No."
                                value={streetHomeNo}
                                onChangeText={(text) => setStreetHomeNo(text)}
                            />
                            {errors.streetHomeNo && <Text style={Styles.errorText}>{errors.streetHomeNo}</Text>}

                            <TextInput
                                style={[Styles.inputUser2, , Styles.mt8]}
                                placeholder="Zipcode"
                                value={zipcode}
                                onChangeText={(text) => setZipcode(text)}
                            />
                            {errors.zipcode && <Text style={Styles.errorText}>{errors.zipcode}</Text>}

                            {/* Display the selected image */}
                            <Image
                                key={imageUrl} // Use imageUrl as the key
                                source={{ uri: imageUrl }}
                                style={Styles.dummyImg}
                            />

                            {/* Buttons for image selection and submission */}
                            <View style={Styles.flex2}>
                                <View style={Styles.viewLogin3}>
                                    <TouchableHighlight
                                        style={Styles.leftBtn}
                                        onPress={handleImagePicker}
                                        disabled={false}
                                    >
                                        <Text style={Styles.txtBtn}>Select Image</Text>
                                    </TouchableHighlight>

                                    <TouchableHighlight
                                        style={Styles.rightBtn}
                                        onPress={handleCameraCapture}
                                        disabled={false}
                                    >
                                        <Text style={Styles.txtBtn}>Capture Image</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>

                            <TouchableHighlight
                                style={Styles.buttonDash}
                                onPress={handleImageUploadAndSave}
                                disabled={false}
                            >
                                <Text style={Styles.txtBtn}>Submit</Text>
                            </TouchableHighlight>
                        </View>

                    </View>
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
};

// Export the Profile component
export default Profile;
