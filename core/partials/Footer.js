
import { Text, View, Alert, Image, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLaptop } from '@fortawesome/free-solid-svg-icons/faLaptop';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faIdCardClip } from '@fortawesome/free-solid-svg-icons/faIdCardClip';
import Styles from '../Styles';

const Footer = (props) => {
    const { userId } = props;
    const navigation = useNavigation();

    return (
        <View style={Styles.dashFooter}>
            <TouchableHighlight onPress={() => navigation.navigate('Dashboard', { userId })} underlayColor="transparent">
                <View>
                    <FontAwesomeIcon style={Styles.linksBot} icon={faHome} size={24} />
                </View>
            </TouchableHighlight>

            <TouchableHighlight
                onPress={() => navigation.navigate('Profile', { userId })}
                underlayColor="transparent"
            >
                <View>
                    <FontAwesomeIcon style={Styles.linksBot} icon={faUser} size={24} />
                </View>
            </TouchableHighlight>

            <TouchableHighlight
                onPress={() => navigation.navigate('Contact', { userId })}
                underlayColor="transparent"
            >
                <View>
                    <FontAwesomeIcon style={Styles.linksBot} icon={faIdCardClip} size={24} />
                </View>
            </TouchableHighlight>

            <TouchableHighlight
                onPress={() => navigation.navigate('Brands', { userId })}
                underlayColor="transparent"
            >
                <View>
                    <FontAwesomeIcon style={Styles.linksBot} icon={faLaptop} size={26} />
                </View>
            </TouchableHighlight>
        </View>
    )
}
export default Footer;