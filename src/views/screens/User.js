import { Text, StyleSheet, View, Image, ScrollView, TouchableHighlight, RefreshControl, Modal, TextInput, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Update_Profile from './Update_Profile';
import Update_Post from './Update_Post';

const User = ({ api_acc }) => {
    const [data, setdata] = useState([]);
    const [reloading, setreloading] = useState(false);

    const getList = async () => {
        try {
            const response = await fetch(
                api_acc,
            );
            const json = await response.json();
            setdata(json);
        } catch (error) {
        }
    }

    useEffect(() => {
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
        <View style={{ padding: 5 }}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={reloading}
                    onRefresh={reloadData} />
            }>
                {
                    data.map((item, index, arr) => {
                        return <Profile key={index} id={item.id} fullname={item.fullname} bio={item.bio} avatar={item.avatar}
                            phone={item.phone} email={item.email} password={item.password} catId={item.catId} />
                    })
                }
            </ScrollView>
        </View>
    )
}

const Profile = (props) => {
    const navigation = useNavigation();
    var api_post_ofuser = "http://192.168.1.4:3000/posts/?_expand=account&&accountId=";
    var api_acc = "http://192.168.1.4:3000/accounts/"
    var api_posts = "http://192.168.1.4:3000/posts/";

    const [post, setpost] = useState([]);
    const [error, seterror] = useState("");
    const [showDLUD_bio, setshowDLUD_bio] = useState(false);
    const [showDLUD_pro5, setshowDLUD_pro5] = useState(false);
    const [reloading, setreloading] = useState(false);
    
    const getListPost = async () => {
        try {
            const response = await fetch(
                api_post_ofuser + props.id,
            );
            const json = await response.json();
            setpost(json.reverse());
            if (json.length == 0) {
                seterror('No post.');
            } else {
                seterror('');
            }
        } catch (error) {
        }
    }
    useEffect(() => {
        getListPost();
    }, []);

    const reloadData = React.useCallback(() => {
        setreloading(true);
        setTimeout(() => {
            setreloading(false);
            getListPost();
        }, 1500);
    })

    const handleLogOut = async () => {
        await AsyncStorage.removeItem("tb_account");
        navigation.navigate('Login');
    }

    const Update_Bio = (props) => {
        const [bio, setbio] = useState(props.bio);

        const Update = () => {
            let objSP = {
                fullname: props.fullname, bio: bio, avatar: props.avatar, phone: props.phone, email: props.email,
                password: props.password, catId: props.catId
            };
            fetch(props.api + props.id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objSP)
            })
                .then((res) => {
                    if (res.status == 200)
                        props.setDL(false);
                })
                .catch((err) => { console.log(err); });
        }
        return (
            <View style={{ width: 240, height: 150, backgroundColor: '#C0C0C0', borderRadius: 15 }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <View style={{ alignItems: 'center', padding: 5, marginTop: 10 }}>
                        <TextInput placeholder="Bio" multiline
                            style={styles.input1} value={bio} onChangeText={setbio}></TextInput>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{
                        marginRight: 1,
                        fontSize: 13, textAlign: 'center', marginTop: 10, width: 119, height: 30, color: 'white',
                        backgroundColor: '#FF0000', textAlignVertical: 'center', borderBottomLeftRadius: 15
                    }}
                        onPress={() => { props.setDL(false) }} >Cancel</Text>

                    <Text style={{
                        marginLeft: 1,
                        fontSize: 13, textAlign: 'center', marginTop: 10, width: 119, height: 30, color: 'white',
                        backgroundColor: '#FF0000', textAlignVertical: 'center', borderBottomRightRadius: 15
                    }}
                        onPress={() => { Update() }} >Ok</Text>
                </View>

            </View>

        )
    }

    return (
        <View>
            <View style={{ alignItems: 'center' }}>
                <Image source={{ uri: props.avatar }}
                    style={{ width: 120, height: 120, borderRadius: 100 }} />
                <Text style={{ fontSize: 17, fontWeight: 'bold', padding: 10 }}>{props.fullname}</Text>
                <Text style={{ fontSize: 12, marginTop: -5 }}>{props.bio} </Text>

                <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                    <Text style={{
                        backgroundColor: 'white', color: 'blue',
                        fontSize: 12, height: 25, textAlign: 'center', width: 60, padding: 4, borderColor: 'blue', borderWidth: 0.5
                    }} onPress={() => setshowDLUD_bio(true)}>
                        Edit Bio</Text>

                    <Text style={{
                        backgroundColor: 'white', color: 'blue',
                        fontSize: 12, height: 25, textAlign: 'center', width: 80, padding: 4, marginLeft: 20, borderColor: 'blue', borderWidth: 0.5
                    }} onPress={() => setshowDLUD_pro5(true)} >
                        Edit Profile</Text>

                    <Text style={{
                        backgroundColor: 'white', color: 'blue', marginLeft: 20,
                        fontSize: 12, height: 25, textAlign: 'center', width: 55, padding: 4, borderColor: 'blue', borderWidth: 0.5
                    }} onPress={handleLogOut} >
                        Logout</Text>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showDLUD_bio}
                    onRequestClose={() => {
                        setshowDLUD_bio(!showDLUD_bio);
                    }}>
                    <View style={styles.centeredView}>
                        <Update_Bio setDL={setshowDLUD_bio} id={props.id} bio={props.bio} fullname={props.fullname} phone={props.phone}
                            email={props.email} password={props.password} catId={props.catId} avatar={props.avatar} api={api_acc} />
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showDLUD_pro5}
                    onRequestClose={() => {
                        setshowDLUD_pro5(!showDLUD_pro5);
                    }}>
                    <View style={styles.centeredView}>
                        <Update_Profile setDL={setshowDLUD_pro5} id={props.id} bio={props.bio} fullname={props.fullname} phone={props.phone}
                            email={props.email} password={props.password} catId={props.catId} avatar={props.avatar} api={api_acc} />
                    </View>
                </Modal>

                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{post.length}</Text>
                        <Text style={{ fontSize: 13 }}>Post</Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 80 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>30</Text>
                        <Text style={{ fontSize: 13 }}>Follower</Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 80 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>0</Text>
                        <Text style={{ fontSize: 13 }}>Following</Text>
                    </View>
                </View>
                <Text >{error}</Text>
                <ScrollView refreshControl={
                    <RefreshControl refreshing={reloading}
                        onRefresh={reloadData} />
                }>
                    {
                        post.map((item, index, arr) => {
                            return <TouchableHighlight activeOpacity={0.5} underlayColor={'pink'} onPress={() => {
                                navigation.navigate('Detail_Post',
                                    { title: item.title, author: item.account.fullname, content: item.content, image: item.image, date: item.date })
                            }}>
                                <Post_in_Profile key={index} id={item.id} title={item.title} date={item.date} image={item.image} content={item.content}
                                    fullname={item.account.fullname} avatar={item.account.avatar} api={api_posts + item.id} id_acc={item.account.id} />
                            </TouchableHighlight>
                        })
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const Post_in_Profile = (props) => {
    const [showDialog, setshowDialog] = useState(false);
    return (
        <View style={styles.item} >
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: props.avatar }} style={{ width: 40, height: 40, borderRadius: 100 }} />
                <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 10, marginTop: 3 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{props.fullname}</Text>
                    <Text style={{ fontSize: 10 }}>{props.date}</Text>
                </View>

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
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 10 }}
                    onPress={() => { setshowDialog(true) }}>...</Text>
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
    )
}

const ShowSelectEdit_Delete = (props) => {
    const [showDLUD, setshowDLUD] = useState(false);
    return (
        <View style={{ width: 200, height: 140, backgroundColor: '#C0C0C0', borderRadius: 15 }}>
            <View style={{ padding: 20 }}>
                <TouchableHighlight onPress={() => { setshowDLUD(true) }} underlayColor={'#888888'} >
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../../../assets/images/ic_edit.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{ fontSize: 13, marginLeft: 7 }} >Edit post</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor={'#888888'} onPress={() => { handleDelete(props.api), props.setDL(false) }}
                    style={{ marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', height: 20 }}>
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
        padding: 5,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input1: {
        borderWidth: 0.5,
        padding: 10,
        width: 200,
        height: 80,
        borderRadius: 3,
        borderColor: 'green',
        fontSize: 13,
        textAlignVertical: 'top'
    },
})

export default User;