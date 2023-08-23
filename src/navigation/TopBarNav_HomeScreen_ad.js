import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Posts_admin from '../views/screens/Posts_admin';
import Follower from '../views/screens/Follower';

const Tab = createMaterialTopTabNavigator();

const TopBarNav = () => {
    return (
        <Tab.Navigator
            initialRouteName="Posts_admin"
            screenOptions={{
                tabBarLabelStyle: { fontSize: 11, fontWeight: 'bold', marginTop: -5 },
                tabBarItemStyle: { width: 200 },
                tabBarStyle: { backgroundColor: 'powderblue', width: 400, height: 40 },
                tabBarPressColor: 'white',
                tabBarActiveTintColor: 'red',
                tabBarInactiveTintColor: 'black',

            }}
        >
            <Tab.Screen name="Posts_admin" component={Posts_admin} options={{ tabBarLabel: 'Post' }} />
            <Tab.Screen name="Follower" component={Follower} options={{ tabBarLabel: 'Follower' }} />
        </Tab.Navigator>


    )
}

export default TopBarNav;