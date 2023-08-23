import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../../conts/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';

const RegistrationScreen = ({ route }) => {
  const [inputs, setInputs] = React.useState({
    email: '',
    fullname: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError('Please input email!', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email!', 'email');
      isValid = false;
    }

    if (!inputs.fullname) {
      handleError('Please input fullname!', 'fullname');
      isValid = false;
    }

    if (!inputs.phone) {
      handleError('Please input phone number!', 'phone');
      isValid = false;
    } else if (!inputs.phone.match(/^0[2-9]{1}[0-9]{8}$/)) {
      handleError('Please input a valid phone number!', 'phone');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('Please input password!', 'password');
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError('Min password length of 5!', 'password');
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };

  const register = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        setLoading(false);
        var api = route.params.api;
        var check_email = api + "?email=" + inputs.email;
        var url_img = "https://tinypng.com/images/social/website.jpg";

        fetch(check_email)
          .then((res) => {
            return res.json();
          })
          .then(async (data) => {
            if (data.length == 0) {
              let objSP = { fullname: inputs.fullname, email: inputs.email, phone: inputs.phone, password: inputs.password, image: url_img };
              fetch(api, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(objSP)
              })
                .then((res) => {
                  if (res.status == 201)
                    Alert.alert(
                      'Congratulations!',
                      'You have created an account by successfully!',
                      [
                        { text: 'OK', onPress: navigation.navigate('Login') },
                      ]
                    )
                })
            } else {
              handleError('This email address has already been used!', 'email');
              isValid = false;
            }
          })

      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Error: ' + error);
      }
    }, 1000);
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({ ...prevState, [input]: error }));
  };
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <Loader visible={loading} />
      <ScrollView
        contentContainerStyle={{ paddingTop: 35, paddingHorizontal: 20 }}>
        <Text style={{ color: COLORS.black, fontSize: 40, fontWeight: 'bold' }}>
          Register
        </Text>
        <Text style={{ color: COLORS.grey, fontSize: 18, marginVertical: 10 }}>
          Enter Your Details to Register
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="email-outline"
            label="Email"
            placeholder="Enter your email address"
            error={errors.email}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'fullname')}
            onFocus={() => handleError(null, 'fullname')}
            iconName="account-outline"
            label="Full Name"
            placeholder="Enter your full name"
            error={errors.fullname}
          />

          <Input
            keyboardType="numeric"
            onChangeText={text => handleOnchange(text, 'phone')}
            onFocus={() => handleError(null, 'phone')}
            iconName="phone-outline"
            label="Phone Number"
            placeholder="Enter your phone number"
            error={errors.phone}
          />
          <Input
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            iconName="lock-outline"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            password
          />
          <Button title="Register" onPress={validate} />
          <Text
            onPress={() => navigation.navigate('Login')}
            style={{
              color: COLORS.black,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
            }}>
            Already have account ? Login
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
