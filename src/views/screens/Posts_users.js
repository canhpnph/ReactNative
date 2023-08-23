import { Text, StyleSheet, View, TouchableHighlight, ScrollView, Image, RefreshControl } from 'react-native'
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

var api_posts = "http://192.168.1.4:3000/posts/";


const Posts_users = () => {
    const [data, setdata] = useState([]);
    const navigation = useNavigation();
    const [reloading, setreloading] = useState(false);

    const getList = () => {
        fetch(api_posts + "?_expand=account")
            .then((res) => {
                return res.json();
            })
            .then((dulieu_json) => {
                setdata(dulieu_json.reverse());
            })
            .catch((err) => {
                console.log('có lỗi ' + err);
            });
    }

    React.useEffect( () => {
        getList();
    }, []);
    
    const reloadData = React.useCallback(() => {
        setreloading(true);
        setTimeout(() => {
            setreloading(false);
            getList();
        }, 1500);
    })

    return (
        <View style={{ backgroundColor: "#CCFFFF", height: '100%' }}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={reloading}
                    onRefresh={reloadData} />
            }>
                {
                    data.map((item, index, arr) => {
                        return <TouchableHighlight activeOpacity={0.6} underlayColor="pink"
                            onPress={() => { navigation.navigate('Detail_Post', { title: item.title, author: item.account.fullname, content: item.content, image: item.image, date: item.date }) }}>
                            <ItemData key={index} id={item.id} title={item.title} author={item.account.fullname} avatar={item.account.avatar} content={item.content} date={item.date} image={item.image} />
                        </TouchableHighlight>
                    })
                }
            </ScrollView>
            
        </View>
    )

}

const ItemData = (props) => {
    return (
        <View style={styles.item} >
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: props.avatar }} style={{ width: 40, height: 40, borderRadius: 100 }} />
                <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 10, marginTop: 3 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{props.author}</Text>
                    <Text style={{ fontSize: 10, marginLeft: -1 }}>{props.date}</Text>
                </View>
                <TouchableHighlight activeOpacity={0.6} underlayColor="pink" style={{ marginTop: 3 }} >
                    <Text style={{ textAlign: 'center', borderRadius: 5, width: 100, height: 25, backgroundColor: 'blue', padding: 3.5, color: 'white', fontSize: 11 }}>FOLLOW</Text>
                </TouchableHighlight>
            </View>
            <View style={{ padding: 10, flexDirection: 'column' }}>
                <Text style={{ fontSize: 13, numberOfLines: 2, padding: 5 }}>{props.title}</Text>
                <Image source={{ uri: props.image }} style={styles.image}></Image>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        padding: 10,
        margin: 5,
        borderRadius: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 0.2,
    },
    image: {
        width: 350,
        height: 200,
        alignItems: 'flex-start',
        borderRadius: 10,
    },
    text: {
        paddingLeft: 30,
        fontSize: 15,
    },
})

export default Posts_users;