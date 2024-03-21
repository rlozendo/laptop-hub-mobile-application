/**
 * THIS WILL GOING TO HANDLE THE CONTACT SCREEN
 */
import React, { useState, useEffect } from 'react';
import { TextInput, ScrollView, View, Text, Image, TouchableHighlight, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faIdCardClip } from '@fortawesome/free-solid-svg-icons/faIdCardClip';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { faLaptop } from '@fortawesome/free-solid-svg-icons/faLaptop';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { onValue, ref } from 'firebase/database';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import * as MailComposer from 'expo-mail-composer';

import Styles from '../Styles';

const Contact = (props) => {
    // DECLARE VARIABLES
    const { route } = props;
    const { userId } = route.params;
    const navigation = useNavigation();
    const [userEmail, setUserEmail] = useState('');
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [sender, setSender] = useState(true);
    const [messageError, setMessageError] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const theMsg = 'Please do not hesitate to utilize this contact form at your convenience. We assure you that upon submission, our team will promptly reach out to you, striving to address your inquiry or request as swiftly as possible. Your communication is highly valued, and we look forward to the opportunity to assist you.';
    const [avatar, setAvatar] = useState('');

    const onMessageChangeHandler = (value) => {
        setEmailMessage(value);
        setMessageError('');
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

    const onSubjectChangeHandler = (value) => {
        setEmailSubject(value);
        setSubjectError('');
    };

    useEffect(() => {
        //reset error
        setMessageError('');
        setSubjectError('');

        navigation.setOptions({
            headerLeft: () => false,
        });

        const userRef = ref(db, `users/${userId}`);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.email) {
                setUserEmail(userData.email);
            }
            if (userData && userData.firstName) {
                setUserFirstName(userData.firstName);
            }
            if (userData && userData.lastName) {
                setUserLastName(userData.lastName);
            }
            if (userData && userData.information && userData.information.phoneNo) {
                setPhone(userData.information.phoneNo);
            }
        });
    }, [navigation, userId]);

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

    const validateInput = () => {
        let isValid = true;

        // Validate message
        if (emailMessage.trim() === '') {
            setMessageError('Message cannot be empty');
            isValid = false;
        } else {
            setMessageError(null);
        }

        // Validate subject
        if (emailSubject.trim() === '') {
            setSubjectError('Subject cannot be empty');
            isValid = false;
        } else {
            setSubjectError(null)
        }

        return isValid;
    };

    const sendMessage = async () => {
        if (!validateInput()) {
            return;
        }

        setIsLoading(true);

        const isEmailAvailable = await MailComposer.isAvailableAsync();

        if (isEmailAvailable) {
            if (sender) {
                let options = {
                    recipients: ['melster@2fxmedia.net'],
                    ccRecipients: [userEmail],
                    subject: emailSubject,
                    body: emailMessage,
                    isHtml: true,
                };
                MailComposer.composeAsync(options)
                    .then((result) => {
                        Alert.alert(`Status: ${result.status}! Thank you for contacting us, we will contact you as soon as possible.`);
                    })
                    .finally(() => {
                        setIsLoading(false);
                        setEmailMessage('');
                        setEmailSubject('');
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
                {/* FOOTER START */}

                <View style={Styles.container}>
                    <ScrollView>
                        <View>
                            <Text style={{ display: 'none' }}>{userId}</Text>
                            <Text style={{ display: 'none' }}>{userFirstName} {userLastName} {userEmail} {phone}</Text>

                            <Text style={[Styles.para, Styles.paraJustify]}>
                                Hi {userFirstName}, {theMsg}
                            </Text>

                            <View style={Styles.formContainer}>
                                <TextInput
                                    style={[Styles.contactTextarea, Styles.inputUserHelper, Styles.inputUserHelper2]}
                                    multiline
                                    numberOfLines={3}
                                    placeholder="Please enter your inquiry.."
                                    onChangeText={onMessageChangeHandler}
                                    value={emailMessage}
                                />
                                {messageError && (
                                    <>
                                        <Text style={[Styles.errorText, Styles.mb5]}>{messageError}</Text>
                                    </>
                                )}
                                <TextInput
                                    style={[Styles.contactSubject, Styles.centered, Styles.inputUserHelper]}
                                    placeholder="Subject.."
                                    onChangeText={onSubjectChangeHandler}
                                    value={emailSubject}
                                />
                                {subjectError && (
                                    <>
                                        <Text style={Styles.errorText}>{subjectError}</Text>
                                    </>
                                )}


                                <TouchableHighlight style={[Styles.buttonDash, Styles.mt8]} onPress={sendMessage}>
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
            </View>
        </GestureHandlerRootView>
    );
};

export default Contact;
