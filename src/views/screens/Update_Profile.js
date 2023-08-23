import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Image, Alert, Modal, Button, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const Update_Profile = (props) => {
    const [fullname, setfullname] = useState(props.fullname);
    const [bio, setbio] = useState(props.bio);
    const [phone, setphone] = useState(props.phone);
    const [password, setpassword] = useState(props.password);
    const [img_base64, setiimg_base64] = useState(props.avatar)
    const [showDLUD_name, setshowDLUD_name] = useState(false);
    const [showDLUD_phone, setshowDLUD_phone] = useState(false);
    const [showDLUD_pass, setshowDLUD_pass] = useState(false);

    const pickImage = async () => {
        // Đọc ảnh từ thư viện thì không cần khai báo quyền
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3], // khung view cắt ảnh 
            quality: 1,
        });

        if (!result.canceled) {
            // chuyển ảnh thành base64 để upload lên json
            let _uri = result.assets[0].uri;  // địa chỉ file ảnh đã chọn
            let file_ext = _uri.substring(_uri.lastIndexOf('.') + 1); // lấy đuôi file


            FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' })
                .then((res) => {
                    // phải nối chuỗi với tiền tố data image
                    setiimg_base64("data:image/" + file_ext + ";base64," + res);
                });

        }
    }

    const Update = (fullname, bio, phone, email, avatar, password, catId) => {
        if (fullname == "" || content == "") {
            alert("Nhập đầy đủ thông tin !");
            return;
        }
        else {
            let objSP = { fullname: fullname, bio: bio, phone: phone, email: email, password: password, avatar: avatar, catId: catId };
            fetch(props.api, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objSP)
            })
                .then((res) => {
                    if (res.status == 200)
                        Alert.alert('Congratulations', 'Update successfully',
                            [
                                { text: 'OK', onPress: () => { props.setDL(false); } },
                            ],
                            { cancelable: false });
                })
                .catch((err) => { console.log(err); });
        }
        
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 20, width: '100%' }}>
            <TouchableHighlight onPress={() => props.setDL(false)} style={{ width: 25, height: 25, borderRadius: 100 }} underlayColor={'pink'} >
                <Image source={require('../../../assets/images/ic_back.png')} style={{ width: 25, height: 25 }} />
            </TouchableHighlight>

            <View style={{ alignItems: 'center' }}>
                <View >
                    {img_base64 && <Image source={{ uri: img_base64 }} style={{ width: 150, height: 150, borderRadius: 100 }} />}
                </View>
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 10 }} onPress={() => {setshowDLUD_name(true)}} >{fullname}</Text>

            </View>
            <View style={styles.khung}>
                <Text>email:</Text>
                <TouchableHighlight activeOpacity={0.5} underlayColor="pink" onPress={() => {}} >
                    <Text style={{ fontSize: 14, color: 'blue', marginTop: 3 }}>{props.email}</Text>
                </TouchableHighlight>
            </View>
            <View style={styles.khung}>
                <Text>phone number:</Text>
                <TouchableHighlight activeOpacity={0.5} underlayColor="pink" onPress={() => {setshowDLUD_phone(true)}} >
                    <Text style={{ fontSize: 14, color: 'blue', marginTop: 3 }}>{props.phone}</Text>
                </TouchableHighlight>
            </View>
            <View style={styles.khung}>
                <Text>Change password</Text>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showDLUD_name}
                onRequestClose={() => {
                    setshowDLUD_name(!showDLUD_name);
                }}>
                <View style={styles.centeredView}>
                    <Update_Item setDL={setshowDLUD_name} id={props.id} fullname={fullname} bio={bio} value={fullname}
                    phone={phone} avatar={img_base64} api={props.api} />
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showDLUD_phone}
                onRequestClose={() => {
                    setshowDLUD_phone(!showDLUD_phone);
                }}>
                <View style={styles.centeredView}>
                    <Update_Item setDL={setshowDLUD_phone} id={props.id} fullname={fullname} bio={bio} value={phone}
                    phone={phone} avatar={img_base64} api={props.api} />
                </View>
            </Modal>
        </View>


    )
}

const Update_Item = (props) => {
    return (
        <View style={{ width: 300, height: 150, backgroundColor: '#C0C0C0', borderRadius: 15, alignItems: 'center' }}>
            <View style={{ padding: 20 }}>
                <TextInput placeholder='' multiline style={styles.input1} value={props.value}
                 onChangeText={props.setfullname} ></TextInput>
            </View>
            <View style={{ flexDirection: 'row' }}>
                    <Text style={{
                        marginRight: 2,
                        fontSize: 13, textAlign: 'center', marginTop: 10, width: 148, height: 30, color: 'white',
                        backgroundColor: '#FF0000', textAlignVertical: 'center', borderBottomLeftRadius: 15
                    }}
                        onPress={() => { props.setDL(false) }} >Cancel</Text>

                    <Text style={{
                        marginLeft: 2,
                        fontSize: 13, textAlign: 'center', marginTop: 10, width: 148, height: 30, color: 'white',
                        backgroundColor: '#FF0000', textAlignVertical: 'center', borderBottomRightRadius: 15
                    }} >Ok</Text>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input1: {
        borderWidth: 0.5,
        padding: 10,
        width: 250,
        height: 70,
        borderRadius: 3,
        borderColor: 'green',
        fontSize: 13,
        textAlignVertical: 'top'
    },
    input2: {
        borderWidth: 0.5,
        padding: 10,
        width: 380,
        height: 300,
        borderRadius: 3,
        borderColor: 'green',
        fontSize: 13,
        textAlignVertical: 'top'
    },
    input3: {
        borderWidth: 0.5,
        padding: 10,
        width: 380,
        height: 40,
        borderRadius: 3,
        borderColor: 'green',
        fontSize: 13,
    },
    khung: {
        padding: 12,
        borderRadius: 5,
        borderWidth: 0.6,
        backgroundColor: '#DDDDDD',
        marginTop: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
export default Update_Profile;