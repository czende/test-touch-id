import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Alert,
    Image,
} from 'react-native';
import { LocalAuthentication, Constants } from 'expo';
import DropdownAlert from 'react-native-dropdownalert';

export default class App extends Component {
    state = {
        compatible: false,
    };

    componentDidMount() {
        this.checkDeviceForHardware();
    }

    checkDeviceForHardware = async () => {
        let compatible = await LocalAuthentication.hasHardwareAsync();
        this.setState({ compatible });
        if (!compatible) {
            this.showIncompatibleAlert();
        }
    };

    showIncompatibleAlert = () => {
        this.dropdown.alertWithType(
            'error',
            'Incompatible Device',
            'Current device does not have the necessary hardware to use this API.'
        );
    };

    checkForBiometrics = async () => {
        let biometricRecords = await LocalAuthentication.isEnrolledAsync();
        if (!biometricRecords) {
            this.dropdown.alertWithType(
                'warn',
                'No Biometrics Found',
                'Please ensure you have set up biometrics in your OS settings.'
            );
        } else {
            this.handleLoginPress();
        }
    };

    handleLoginPress = () => {
        if (Platform.OS === 'android') {
            this.showAndroidAlert();
        } else {
            this.scanBiometrics();
        }
    };

    showAndroidAlert = () => {
        Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor.');
        this.scanBiometrics();
    };

    scanBiometrics = async () => {
        let result = await LocalAuthentication.authenticateAsync('Biometric Scan.');
        if (result.success) {
            this.dropdown.alertWithType(
                'success',
                'You are you!',
                'Bio-Authentication succeeded.'
            );
        } else {
            this.dropdown.alertWithType(
                'error',
                'Uh oh!',
                'Bio-Authentication failed or canceled.'
            );
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('./assets/logo.png')}
                />
                <TouchableOpacity
                    onPress={
                        this.state.compatible
                            ? this.checkForBiometrics
                            : this.showIncompatibleAlert
                    }
                    style={styles.button}>
                    <Text style={styles.buttonText}>
                        Bio Login
                    </Text>
                </TouchableOpacity>
                <DropdownAlert
                    ref={ref => (this.dropdown = ref)}
                    closeInterval={4000}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#7b1fa2',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 60,
        backgroundColor: 'transparent',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    buttonText: {
        fontSize: 30,
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.30)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    logo: {
        height: 30,
        width: 260,
    },
});
