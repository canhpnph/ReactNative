import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, Button, View, TouchableHighlight, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const Update_Post = (props) => {
    const [title, settitle] = useState(props.title);
    const [content, setcontent] = useState(props.content);
    const [img_base64, setiimg_base64] = useState(props.image);
    const navigation = useNavigation();

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

    const UpdatePost = () => {
        if (title == "" || content == "") {
            alert("Nhập đầy đủ thông tin !");
            return;
        }
        else {
            let objSP = { title: title, content: content, image: img_base64, date: props.date, accountId: props.id_acc };
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
                        Alert.alert('Congratulations', 'This post has been updated.',
                            [
                                { text: 'OK', onPress: () => { props.setDL(false); } },
                            ],
                            { cancelable: false });
                })
                .catch((err) => { console.log(err); });
        }
    }
    return (
        <View style={{ alignItems: 'center', flex: 1, backgroundColor: 'white' }}>
            <View style={{ alignItems: 'center', padding: 5 }}>
                <TextInput placeholder="Title" multiline style={styles.input1} value={title} onChangeText={settitle}></TextInput>
            </View>
            <View style={{ alignItems: 'center', padding: 10 }}>
                <TextInput placeholder="Content" style={styles.input2} value={content}
                    multiline onChangeText={setcontent}></TextInput>
            </View>
            <TouchableHighlight underlayColor={'pink'} activeOpacity={0.5} style={{ padding: 10 }} onPress={pickImage} >
                <Text style={{
                    width: 100, height: 30, backgroundColor: '#800080',
                    color: 'white', borderRadius: 5, textAlign: 'center',
                    textAlignVertical: 'center'
                }}>Select image</Text>
            </TouchableHighlight>
            <View>
                {img_base64 && <Image source={{ uri: img_base64 }} style={{ width: 230, height: 150, borderRadius: 5 }} />}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                <View style={{ width: 80, height: 40, marginTop: 20 }}>
                    <Button title="CANCEL" onPress={() => { props.setDL(false) }} />
                </View>
                <View style={{ width: 80, height: 40, marginTop: 20, marginLeft: 100 }}>
                    <Button title="UPDATE" onPress={UpdatePost} />
                </View>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    input1: {
        borderWidth: 0.5,
        padding: 10,
        width: 380,
        height: 100,
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
})
export default Update_Post;