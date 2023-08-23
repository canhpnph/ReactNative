import {Text, StyleSheet, View, TouchableHighlight, Image, ScrollView, RefreshControl, Modal, Alert } from 'react-native'
import * as React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Update_Post from './Update_Post';

var api_posts = "http://192.168.1.4:3000/posts/";


const Posts_admin = () => {
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
                console.log(err);
            });
    }

    React.useEffect(() => {
        getList();
    }, []);

    const reloadData = React.useCallback(() => {
        setreloading(true);
        setTimeout(() => {
            setreloading(false);
            getList();
        }, 1000);
    })


    return (
        <View style={{ backgroundColor: "#FFFFFF", height: '100%' }}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={reloading}
                    onRefresh={reloadData} />
            }>
                {
                    data.map((item, index, arr) => {
                        return <TouchableHighlight activeOpacity={0.6} underlayColor="pink"
                            onPress={() => { navigation.navigate('Detail_Post', { title: item.title, author: item.account.fullname, content: item.content, image: item.image, date: item.date }) }}>
                            <ItemData key={index} id={item.id} title={item.title} author={item.account.fullname}
                                avatar={item.account.avatar} content={item.content} date={item.date} image={item.image}
                                id_acc={item.account.id} api={api_posts + item.id} />
                        </TouchableHighlight>
                    })
                }
            </ScrollView>
            <FloatingActionButton onPress={() => { navigation.navigate('New_Post', { api_posts: api_posts }) }}></FloatingActionButton>
        </View>
    )

}

const ItemData = (props) => {
    const [datafrom_store, setdatafrom_store] = useState([]);
    const [isButtonFLVisible, setisButtonFLVisible] = useState(true);
    const [isShowModal, setisShowModal] = useState(true);
    const [showDialog, setshowDialog] = useState(false);

    const getIdAcc = async () => {
        try {
            const value = await AsyncStorage.getItem("tb_account");
            if (value !== null) {
                setdatafrom_store(JSON.parse(value));
                if (datafrom_store.id === props.id_acc) {
                    setisButtonFLVisible(false);
                    setisShowModal(true);
                } else {
                    setisButtonFLVisible(true);
                    setisShowModal(false);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    React.useEffect(() => {
        getIdAcc();
    }, []);

    return (

        <View style={styles.item} >
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: props.avatar }} style={{ width: 40, height: 40, borderRadius: 100 }} />
                <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 10, marginTop: 3 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{props.author}</Text>
                    <Text style={{ fontSize: 10, marginLeft: -1 }}>{props.date}</Text>
                </View>
                {isButtonFLVisible && <TouchableHighlight activeOpacity={0.6} underlayColor="pink" style={{ marginTop: 3 }} >
                    <Text style={{
                        textAlign: 'center', borderRadius: 5, width: 100, height: 25,
                        backgroundColor: 'blue', padding: 3.5, color: 'white', fontSize: 11, textAlignVertical: 'center',
                    }}>FOLLOW</Text>
                </TouchableHighlight>}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showDialog}
                    onRequestClose={() => {
                        setshowDialog(!showDialog);
                    }}>
                    <View style={styles.centeredView}>
                        <ShowSelectEdit_Delete setDL={setshowDialog} api={props.api} id={props.id} date={props.date}
                         title={props.title} content={props.content} image={props.image} id_acc={props.id_acc} />
                    </View>
                </Modal>
                {isShowModal && <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 5 }}
                    onPress={() => { setshowDialog(true) }}>...</Text>}
            </View>
            <View style={{ padding: 10, flexDirection: 'column' }}>
                <Text style={{ fontSize: 13, numberOfLines: 2, padding: 5 }}>{props.title}</Text>
                <Image source={{ uri: props.image }} style={styles.image}></Image>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', padding: 5 }}>
                    <Text style={{ fontSize: 13, marginLeft: 5, textAlign: 'center' }}>72 likes</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 60 }}>
                    <Text style={{ fontSize: 13, marginLeft: 5, textAlign: 'center' }}>2 comments</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 60 }}>
                    <Text style={{ fontSize: 13, marginLeft: 5, textAlign: 'center' }}>3 shares</Text>
                </View>
            </View>

            <View style={{ width: 335, height: 1, backgroundColor: 'black', alignSelf: 'center' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Image source={require('../../../assets/images/ic_like.png')} style={{ width: 20, height: 20 }} />
                    <Text style={{ fontSize: 13, marginLeft: 5, textAlign: 'center' }}>Like</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 60 }}>
                    <Image source={require('../../../assets/images/ic_cmt.png')} style={{ width: 20, height: 20 }} />
                    <Text style={{ fontSize: 13, marginLeft: 5, textAlign: 'center' }}>Comment</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 60 }}>
                    <Image source={require('../../../assets/images/ic_share.png')} style={{ width: 20, height: 20 }} />
                    <Text style={{ fontSize: 13, marginLeft: 5, textAlign: 'center' }}>Share</Text>
                </View>
            </View>

        </View>
    );
}

const FloatingActionButton = ({ onPress }) => (
    <TouchableHighlight
        style={{
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            position: 'absolute',
            bottom: 20,
            right: 20,
            height: 50,
            backgroundColor: '#6600FF',
            borderRadius: 100,
        }}
        onPress={onPress}
    >
        <Text style={{ fontSize: 30, color: 'white' }}>+</Text>
    </TouchableHighlight>
);

const ShowSelectEdit_Delete = (props) => {
    const [showDLUD, setshowDLUD] = useState(false);
    return (
        <View style={{ width: 200, height: 140, backgroundColor: '#C0C0C0', borderRadius: 15 }}>
            <View style={{ padding: 20 }}>
                <TouchableHighlight onPress={() => {setshowDLUD(true)}} underlayColor={'#888888'} >
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../../../assets/images/ic_edit.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{ fontSize: 13, marginLeft: 7 }} >Edit post</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#888888'} onPress={() => { handleDelete(props.api), props.setDL(false) }} 
                style={{marginTop: 20}}>
                    <View style={{ flexDirection: 'row',  height: 20 }}>
                        <Image source={require('../../../assets/images/ic_del.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{ fontSize: 13, marginLeft: 7 }} >Delete post</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <Text style={{
                fontSize: 13, textAlign: 'center', marginTop: 10, width: 200, height: 30, color: 'white',
                backgroundColor: '#FF0000', textAlignVertical: 'center', borderBottomLeftRadius: 15, borderBottomRightRadius: 15
            }}
                onPress={() => { props.setDL(false) }} >Cancel</Text>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showDLUD}
                onRequestClose={() => {
                    setshowDLUD(!showDLUD);
                }}>
                <View style={styles.centeredView}>
                    <Update_Post setDL={setshowDLUD} id={props.id} title={props.title} content={props.content}
                     image={props.image} api={props.api} id_acc={props.id_acc} date={props.date} />
                </View>
            </Modal>
        </View>
    )
}

const handleDelete = (api) => {
    //const navigation = useNavigation();
    Alert.alert(
        '[DELETE]',
        'Can you confirm delete this post ?',
        [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed '), style: 'cancel' },
            { text: 'OK', onPress: () => { DeleteData(api) } },
        ],
        { cancelable: false }
    )

    const DeleteData = (api) => {
        return (
            fetch(api, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => {
                    console.log(res);
                    if (res.status == 200)
                        alert("Delete succesfully !");
                    //navigation.navigate('List_Contact');
                })
                .catch((err) => { console.log(err); })
        );
    }
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
        backgroundColor: '#EEEEEE'
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default Posts_admin;