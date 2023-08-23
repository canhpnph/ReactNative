import { View, Text, SafeAreaView, Keyboard, Alert, Image } from 'react-native';
import COLORS from '../../conts/colors';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

var api_account = "http://192.168.1.4:3000/accounts/"

const LoginScreen = ({ navigation }) => {
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // const navigation = useNavigation();

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please input email', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    }
    if (isValid) {
      login();
    }
  };

  const login = () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      var check_email = api_account + "?email=" + inputs.email;

      fetch(check_email)
        .then((res) => {
          return res.json();
        })
        .then(async (data) => {
          if (data.length == 0) {
            handleError('Email or password incorrect!', 'email');
            handleError('Email or password incorrect!', 'password');
            isValid(false);
          } else {
            let objU = data[0];
            if (objU.password != inputs.password) {
              handleError('Password incorrect!', 'password');
              isValid(false);
            } else {
              if (objU.catId == 1) {
                navigation.navigate('Home_ad', {api_acc: check_email});

                let value = JSON.stringify(objU);
                try {
                  await AsyncStorage.setItem("tb_account", value);
                } catch (e) {
                  console.log(e);
                }
              } else {
                navigation.navigate('Home_user', { api_acc: check_email });

                let value = JSON.stringify(objU);
                try {
                  await AsyncStorage.setItem("tb_account", value);
                } catch (e) {
                  console.log(e);
                }
              }
            }
          }
        })

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
      <View style={{ paddingTop: 35, paddingHorizontal: 20 }}>
        <Text style={{ color: COLORS.black, fontSize: 40, fontWeight: 'bold' }}>
          Log In
        </Text>
        <Text style={{ color: COLORS.grey, fontSize: 18, marginVertical: 10 }}>
          You could make pleasant discovery
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
            onChangeText={text => handleOnchange(text, 'password')}
            onFocus={() => handleError(null, 'password')}
            iconName="lock-outline"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            password
          />
          <Button title="Log In" onPress={validate} />
          <Text
            onPress={() => navigation.navigate('Register', { api: api_account })}
            style={{
              color: COLORS.black,
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 16,
            }}>
            Don't have account ? Register
          </Text>
          <Text style={{
            textAlign: 'center',
            fontSize: 14,
            color: COLORS.black,
            marginTop: 10
          }}>or</Text>
          <View style={{ flexDirection: "row", marginTop: 15, alignItems: 'center', alignContent: 'center' }}>
            <View style={{
              flexDirection: 'row', backgroundColor: '#1877f2',
              width: 170, height: 40,
              borderRadius: 9, alignContent: 'center',
              alignItems: 'center',
            }}>
              <Image source={require('../../../assets/images/logo_fb.png')}
                style={{ width: 30, height: 30 }}
              />
              <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14 }}>Login with Facebook</Text>
            </View>

            <View style={{
              flexDirection: 'row', backgroundColor: '#dd4b39',
              width: 170, height: 40,
              borderRadius: 9, alignContent: 'center',
              alignItems: 'center',
              padding: 8,
              marginLeft: 10
            }}>
              <Image source={require('../../../assets/images/logo_gg.png')}
                style={{ width: 25, height: 25 }}
              />
              <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14, marginLeft: 5 }}>Login with Google</Text>
            </View>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
