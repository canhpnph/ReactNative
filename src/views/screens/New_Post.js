import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, Button, View, TouchableHighlight, Image, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const New_Post = ({ route }) => {
  const [title, settitle] = useState("")
  const [content, setcontent] = useState("")
  const [image, setimage] = useState("")

  const [img_base64, setiimg_base64] = useState("")
  const [id_acc, setid_acc] = useState("");
  const navigation = useNavigation();

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("tb_account");
      if (value !== null) {
        setid_acc(JSON.parse(value));
      }

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  })

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
  const AddNewData = async () => {
    let objSP;
    if (title == "" || content == "") {
      alert("Nhập đầy đủ thông tin !");
    } else {
      const now = new Date();
      const formattedDate = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
      if (image == "") {
        objSP = { title: title, content: content, image: img_base64, date: formattedDate, accountId: id_acc.id };
      } else if (img_base64 == "") {
        objSP = { title: title, content: content, image: image, date: formattedDate, accountId: id_acc.id };
      }

      fetch(route.params.api_posts, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objSP)
      })
        .then((res) => {
          console.log(res);
          if (res.status == 201)
            Alert.alert('Congratulations', 'This post has been uploaded',
              [
                { text: 'OK', onPress: () => { navigation.goBack(); } },
              ],
              { cancelable: false });

        })
        .catch((err) => { console.log(err); });
    }

  }


  return (
    <ScrollView>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={{ alignItems: 'center', padding: 5 }}>
          <TextInput placeholder="Title" multiline style={styles.input1} onChangeText={settitle}></TextInput>
        </View>
        <View style={{ alignItems: 'center', padding: 10 }}>
          <TextInput placeholder="Content" style={styles.input2}
            multiline onChangeText={setcontent}></TextInput>
        </View>
        <View style={{ alignItems: 'center', padding: 10 }}>
          <TextInput placeholder="Image link" style={styles.input3} onChangeText={setimage}></TextInput>
        </View>
        <Text>or</Text>
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
            <Button title="CANCEL" onPress={() => navigation.goBack()} />
          </View>
          <View style={{ width: 80, height: 40, marginTop: 20, marginLeft: 100 }}>
            <Button title="POST" onPress={AddNewData} />
          </View>
        </View>

      </View>
    </ScrollView>

  );
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

export default New_Post;