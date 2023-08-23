import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { View, Text, focused, size } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from '../views/screens/Video';
import User from '../views/screens/User';
import Posts_admin from '../views/screens/Posts_admin';

const homeName = 'Home';
const videoName = 'Video';
const userName = 'User';

const Tab = createBottomTabNavigator();

const Tabs_ad = ({route}) => {
    const {api_acc} = route.params;
    return (
            <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;
                    if(rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if(rn === videoName) {
                        iconName = focused ? 'film' : 'film-outline';
                    } else if(rn === userName) {
                        iconName = focused ? 'person-sharp' : 'person-sharp';
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray'
            })}
            
            >
                <Tab.Screen name="Home" component={Posts_admin} options={{headerStatusBarHeight: -35, headerTitle: '' }} />
                <Tab.Screen name="Video" component={Video} options={{headerStatusBarHeight: -35, headerTitle: ''}}/>
                <Tab.Screen name='User' component={() => <User api_acc={route.params.api_acc} />} options={{headerStatusBarHeight: -35, headerTitle: ''}}/>
            </Tab.Navigator>
        
    );
}

export default Tabs_ad;