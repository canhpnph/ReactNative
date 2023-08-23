import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/views/screens/LoginScreen';
import RegistrationScreen from './src/views/screens/RegistrationScreen';
import Tabs_ad from './src/navigation/Tabs_ad';
import Tabs_user from './src/navigation/Tabs_user';
import Detail_Post from './src/views/screens/Detail_Post';
import New_Post from './src/views/screens/New_Post';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} options={{ title: 'Đăng nhập', headerShown: false}} />
        <Stack.Screen name='Register' component={RegistrationScreen} options={{ title: 'Đăng ký' , headerShown: false}} />
        <Stack.Screen name='Home_ad' component={Tabs_ad} options={{ title: 'Trang chủ', headerShown: false }} />
        <Stack.Screen name='Home_user' component={Tabs_user} options={{ title: 'Trang chủ', headerShown: false }} />
        <Stack.Screen name='Detail_Post' component={Detail_Post} options={{title: 'Chi tiết bài viết'}} />
        <Stack.Screen name='New_Post' component={New_Post} options={{title: 'New Post'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

