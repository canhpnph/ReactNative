import { Text, StyleSheet, View, Image, ScrollView } from 'react-native'
import React, { Component } from 'react'

export default class Video extends Component {
    render() {
        return (
            <View>
                <ScrollView>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ padding: 5 }}>Movie: abc xyzzzzz</Text>
                        <Image source={require('../../../assets/images/film.png')} style={{ width: 350, height: 200 }} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ padding: 5 }}>Movie: abc xyzzzzz</Text>
                        <Image source={require('../../../assets/images/film.png')} style={{ width: 350, height: 200 }} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ padding: 5 }}>Movie: abc xyzzzzz</Text>
                        <Image source={require('../../../assets/images/film.png')} style={{ width: 350, height: 200 }} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ padding: 5 }}>Movie: abc xyzzzzz</Text>
                        <Image source={require('../../../assets/images/film.png')} style={{ width: 350, height: 200 }} />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({})