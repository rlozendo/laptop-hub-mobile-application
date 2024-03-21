/**
 * LOGIN SCREEN
 * LOGIN SCREEN THIS SCREEN WILL GOING TO HANDLE THE LOGIN FUNCTION
 * ON THIS SCREEN, THE USER HAS AN OPTION TO REGISTER
 * IT CAN ALSO IDENTIFY IF THE ACCOUNT HAS ALREADY VERIFIED 
 * IF NOT VERIFIED IT HAS AN OPTION TO RESEND THE CONFIRMATION EMAIL WITH LINK
 */

// IMPORT EVERYTHING WE NEED FOR THIS APP
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, Image, TouchableHighlight, ActivityIndicator, TouchableOpacity, } from "react-native";
import { auth, db } from '../firebaseConfig'; // DATABASE CONNECTION, REALTIME DATABASE OF FIREBASE
import { onValue, ref } from "firebase/database";
import { signInWithEmailAndPassword, sendEmailVerification, } from "firebase/auth";

import Styles from '../Styles';

const Login = (props) => {
    // DECLARATION OF VARIABLES
    const welcomeText = 'Welcome to Laptop Hub';
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    // CHECK THE EMAIL IF VERIFIED
    const checkEmailVerification = async () => {
        if (auth.currentUser) {
            const verified = auth.currentUser.emailVerified;
            setShowResendVerification(!verified);
        }
    };

    const fetchUserProfile = async () => {
        const user = auth.currentUser;

        if (user) {
            const userUID = user.uid;
            const userID = user.uid;
            const Ref = ref(db, "/users/" + userID);

            onValue(Ref, (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserProfile(userData);
                } else {
                    Alert.alert("User data not found in Realtime Database.");
                }
            });
        } else {
            Alert.alert("User not signed in.");
        }
    };

    useEffect(() => {
        checkEmailVerification(); // RUN THE checkEmailVerification 
    }, []);

    // THIS WILL HANDLE THE ERROR ISSUE OF THE LOGIN FORM
    // THE USER NEEDS TO FILL OUT THE USER AND PASS FIELDS 
    // OTHER WISE IT WILL NOT GO THRU
    const handleSignInError = (error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/wrong-password") {
            Alert.alert("Wrong password.");
        } else {
            Alert.alert(errorMessage);
        }
    };

    // THIS WILL HANDLE THE LOGIN, WHEN THE USER CLICKS THE LOGIN BUTTON, IT'S USES THE AUTHENTICATION OF FIREBASE
    // IF THE USER IS SUCCESSFULLY LOGGED IN, IT WILL GO THRU
    // IF NOT IT WILL RETURN AND IT WILL GIVE SOME ERROR
    // IF SUCCESS IT WILL FETCH SOME DATA FROM REALTIME DATABASE
    // IT ALSO USES ActivityIndicator AS A PRELOADER
    const loginWithFirebase = async () => {
        try {
            if (loginEmail.length < 4 || loginPass.length < 4) {
                Alert.alert("Please enter a valid email and password.");
                return;
            }

            setLoading(true); // SET THE LODING VARIABLE TO TRUE TO SHOW THE ActivityIndicator AS A PRELOADER

            const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
            const user = userCredential.user;

            if (user.emailVerified) {
                Alert.alert("User logged in!");
                //setLoggedIn(true);
                checkEmailVerification(); // FUNCTION TO CHECK IF THE ACCOUNT IS VERIFIED OR NOT
                fetchUserProfile(user);
                props.navigation.navigate("Dashboard", { userId: user.uid }); // IF EVERYTHING IS SUCESS, IT WILL REDIRECT TO DASHBOARD SCREEN AND IT PASS THE USER.UID
            } else {
                Alert.alert("Please verify your email address.");
                setShowResendVerification(true);
            }
        } catch (error) {
            handleSignInError(error);
        } finally {
            setLoading(false);
        }
    };

    // FUNCTION TO SEND THE VERIFICATION LINK TO THE EMAIL OF THE USER ACCOUNT
    const sendVerificationEmail = async () => {
        try {
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                Alert.alert("Verification email sent successfully.");
            } else {
                Alert.alert("User not signed in.");
            }
        } catch (error) {
            console.error("Error sending verification email:", error);
            Alert.alert("Failed to send verification email.");
        }

        setShowResendVerification(false);
    };



    return (

        <View style={Styles.flexLogin}>

            <View style={Styles.viewLogin2}>

                <Image style={Styles.logoLogin} source={require('../../assets/logo.png')} />
                <Text style={Styles.text1}>{welcomeText}</Text>

                <TextInput
                    style={Styles.inputUser}
                    onChangeText={(value) => setLoginEmail(value)}
                    autoCapitalize='none'
                    autoCorrect={false}
                    autoCompleteType='email'
                    keyboardType='email-address'
                    placeholder='username@domainname.com'
                    value={loginEmail}
                    editable={!loading}
                />

                <TextInput
                    style={Styles.inputPass}
                    onChangeText={(value) => setLoginPass(value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoCompleteType="password"
                    keyboardType="default"
                    placeholder="Password"
                    value={loginPass}
                    editable={!loading}
                    secureTextEntry={true}
                />

                <View style={Styles.btnHandlers}>
                    {
                        showResendVerification ? (
                            <>
                                <TouchableHighlight
                                    style={Styles.buttonReg}
                                    onPress={sendVerificationEmail}
                                    disabled={loading}
                                >
                                    <Text style={Styles.txtBtn}>Send Verification</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={Styles.buttonLog}
                                    onPress={loginWithFirebase}
                                    //onPress = { () => {Alert.alert('Test', 'ok')} }
                                    disabled={loading || loggedIn}
                                >
                                    <Text style={Styles.txtBtn}>Login</Text>
                                </TouchableHighlight>
                            </>
                        ) : (
                            <>
                                <TouchableHighlight
                                    style={Styles.buttonReg}
                                    onPress={() => props.navigation.navigate('Register')}
                                    disabled={loading || loggedIn}
                                >
                                    <Text style={Styles.txtBtn}>Register</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={Styles.buttonLog}
                                    onPress={loginWithFirebase}
                                    //onPress = { () => {Alert.alert('Test', 'ok')} }
                                    disabled={loading || loggedIn}
                                >
                                    <Text style={Styles.txtBtn}>Login</Text>
                                </TouchableHighlight>
                            </>
                        )
                    }

                </View>

                {loading && (
                    <View style={Styles.spinnerContainer}>
                        <ActivityIndicator size="large" color="#6ed2c8" />
                    </View>
                )}

            </View>

        </View>

    )
}

export default Login;