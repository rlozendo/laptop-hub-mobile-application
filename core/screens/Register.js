/**
 * REGISTER SCREEN
 * THIS SCREEN WILL GOING TO HANDLE THE REGISTRATION FORM
 */

// IMPORT EVERYTHING WE NEED FOR THIS SCREEN
import React, { useState } from 'react';
import { ScrollView, View, TextInput, Text, Alert, ImageBackground, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { db, auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { collection, query, where, getDocs } from 'firebase/firestore';

import Styles from '../Styles';

const Register = (props) => {
    // DECLARATION OF VARIABLES
    const heading = 'Register to Laptop Hub';
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [regFirstName, setRegFirstName] = useState('');
    const [regLastName, setRegLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const clearInputFields = () => {
        setRegEmail('');
        setRegPass('');
        setRegFirstName('');
        setRegLastName('');
    }

    // FUNCTION TO RETRIEVE DATA FROM REALTIME DATABASE
    const getUserDataFromFirestore = async (email) => {
        const userCollectionRef = collection(firestore, 'users');
        const q = query(userCollectionRef, where('email', '==', email));

        try {
            const querySnapshot = await getDocs(q);

            if (querySnapshot.size > 0) {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    console.log('User data from Firestore:', userData);
                });
            } else {
                console.log('No user found in Firestore with the given email.');
            }
        } catch (error) {
            console.error('Error fetching user data from Firestore:', error);
        }
    };

    // FUNCTION TO HANDLE THE REGISTRATION
    // ON REGISTRATION, IT WILL SAVE THE DATA TO AUTHENTICATION OF FIREBASE
    // THEN AFTER THAT IT WILL ALSO SAVE USERS INFO TO REAL TIME DATABASE
    // IT WILL SAVE THE FIRSTNAME, LASTNAME, EMAIL AND EDIT IS = TO TRUE
    // EDIT FIELD WILL GOING TO HANDLE THE FIRST TIME LOGIN OF THE USER ACCOUNT
    // AFTER SUCCESSFULL CREATION OF ACCOUNT, IT WILL REDIRECT TO LOGIN SCREEN
    const registerWithFirebase = () => {
        if (loading) return;

        setLoading(true);

        if (regEmail.length < 4 || regPass.length < 4 || regFirstName.length < 1 || regLastName.length < 1) {
            Alert.alert('Please fill in all the required fields.');
            setLoading(false);
            return;
        }

        createUserWithEmailAndPassword(auth, regEmail, regPass)
            .then(async function (userCredential) {
                const user = userCredential.user; // Get the user object

                if (user) {

                    // Use the user's UID for both Realtime Database and Firestore
                    const uid = user.uid;

                    // Save first name and last name to Realtime Database
                    const dbRef = ref(db, 'users/' + uid);

                    try {
                        await set(dbRef, {
                            firstName: regFirstName,
                            lastName: regLastName,
                            email: regEmail,
                            edit: true
                        });
                        await sendEmailVerification(user);

                        Alert.alert('Registration successful, email verification sent, check your email.');
                        clearInputFields();
                        setLoading(false);
                        props.navigation.navigate('Login');

                        // Success
                        console.log('Data saved to Realtime Database');
                        // Continue with other actions or UI updates
                    } catch (error) {
                        // Error
                        console.error('Error saving data to Realtime Database: ', error);
                        // Handle the error or show a user-friendly message
                    }

                } else {
                    // Handle the case where user creation failed
                    setLoading(false);
                    console.log('User creation failed.');
                }
            })
            .catch((error) => {
                setLoading(false);
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/weak-password') {
                    Alert.alert('The password is too weak.');
                } else {
                    Alert.alert(errorMessage);
                }
                console.log(error);
            });
    }

    return (
        <>
            <View style={Styles.flexLogin}>
                <ScrollView>
                    <View style={Styles.flexLogin}>

                        <View style={Styles.viewLogin2}>
                            <Image
                                source={require('../../assets/logo.png')}
                                style={Styles.logoLogin}
                            />

                            <Text style={Styles.text1}>{heading}</Text>
                            <TextInput
                                style={Styles.inputUser}
                                onChangeText={(value) => setRegEmail(value)}
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoCompleteType='email'
                                keyboardType='email-address'
                                placeholder='username@domainname.com'
                                value={regEmail}
                                editable={!loading} // Disable when loading
                            />

                            <View style={Styles.firstLast}>
                                <TextInput
                                    style={Styles.inputUser}
                                    onChangeText={(value) => setRegFirstName(value)}
                                    autoCapitalize='words'
                                    autoCorrect={false}
                                    placeholder='First Name'
                                    value={regFirstName}
                                    editable={!loading} // Disable when loading
                                />

                                <TextInput
                                    style={Styles.inputUser}
                                    onChangeText={(value) => setRegLastName(value)}
                                    autoCapitalize='words'
                                    autoCorrect={false}
                                    placeholder='Last Name'
                                    value={regLastName}
                                    editable={!loading} // Disable when loading
                                />
                            </View>

                            <TextInput
                                style={[Styles.inputUser, Styles.removeMarginBottom]}
                                onChangeText={(value) => setRegPass(value)}
                                autoCapitalize="none"
                                autoCorrect={true}
                                autoCompleteType="password"
                                keyboardType="default"
                                placeholder="Password"
                                editable={!loading} // Disable when loading
                                secureTextEntry={true}
                            />


                            {loading && (
                                <View style={Styles.spinnerContainer}>
                                    <ActivityIndicator size="large" color="#a7c850" />
                                </View>
                            )}

                            <View style={Styles.btnHandlers}>
                                <>
                                    <TouchableHighlight
                                        style={Styles.buttonReg}
                                        onPress={() => props.navigation.navigate('Login')}
                                        disabled={loading}
                                    >
                                        <Text style={Styles.txtBtn}>cancel</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        style={Styles.buttonLog}
                                        onPress={registerWithFirebase}
                                        disabled={loading}
                                    >
                                        <Text style={Styles.txtBtn}>
                                            register
                                        </Text>
                                    </TouchableHighlight>


                                </>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

export default Register;
