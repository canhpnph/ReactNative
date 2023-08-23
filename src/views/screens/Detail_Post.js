import { Text, StyleSheet, View, Image, ScrollView } from 'react-native'
import React, { Component } from 'react'

const Detail_Post = ({ route }) => {
    return (
        <View style={{ backgroundColor: '#FCE5E5', flex: 1 }}>
            <ScrollView>
                <View style={{ margin: 10 }}>
                    <Image source={{ uri: route.params.image }} style={{ width: 200, height: 200, borderRadius: 10, alignSelf: 'center' }}></Image>
                    <Text style={{ fontSize: 22, color: '#330099', fontWeight: 'bold', margin: 5, alignSelf: 'center' }}>{route.params.title} </Text>
                    <Text style={{ fontSize: 16, color: '#993300', margin: 5, textAlign: 'auto', fontStyle: 'italic' }}>{route.params.content}</Text>
                    <Text style={{ textAlign: 'right' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', margin: 5, textAlign: 'right' }}>Tác giả: {route.params.author}</Text>
                        <Text style={{ color: 'blue', fontSize: 13 }}> * Theo dõi</Text>
                    </Text>
                    <Text style={{ margin: 3, fontSize: 12, textAlign: 'right' }}>{route.params.date}</Text>
                </View>
            </ScrollView>

        </View>
    );
}

export default Detail_Post;
