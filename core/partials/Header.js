import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, Alert, Image, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons/faPowerOff';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';
import { onValue, ref } from 'firebase/database';
import Styles from '../Styles';

const Header = (props) => {
    // DECLARE VARIABLES
    const { userId } = props;
    const navigation = useNavigation();
    const [avatar, setAvatar] = useState('');

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
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.error('Error while logging out:', error);
                Alert.alert('An error occurred while logging out.');
            });
    };

    return (
        <View style={Styles.dashHeader}>
            <Image style={Styles.headerLogo} source={require('../../assets/dash-logo.png')} />
            {avatar && (
                <Image
                    source={{ uri: avatar }}
                    style={Styles.dummyImg2}
                />
            )}
            <TouchableHighlight onPress={Logout} underlayColor="transparent" style={Styles.logOut}>
                <View>
                    <FontAwesomeIcon style={Styles.logOutIcon} icon={faPowerOff} size={24} />
                </View>
            </TouchableHighlight>
        </View>
    )
}
export default Header;