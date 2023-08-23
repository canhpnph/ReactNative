import { Text, StyleSheet, View, Image, ScrollView } from 'react-native'
import React, { Component } from 'react'

const Follower = ({email}) => {
  console.log(email + "follower");
  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 16, padding: 10 }}>Có 30 người theo dõi</Text>
      <ScrollView>
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </ScrollView>
    </View>
  )
}

const Item = () => {
  return (
    <View style={styles.item} >
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: 'https://blog.hootsuite.com/wp-content/uploads/2020/02/Image-copyright-556x556.png' }} style={styles.image}></Image>
        <View style={{ alignSelf: 'center', width: 260 }}>
          <Text style={{ paddingLeft: 30, fontSize: 15, fontWeight: 'bold', height: 60 }}>Nguyễn Như Nguyễn</Text>
          <Text style={{ paddingLeft: 30, textAlign: 'right', flexDirection: 'row' }}>
            <Text style={{ fontSize: 13 }}>Đã theo dõi bạn được 2 ngày</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#DCDCDC',
    padding: 10,
    margin: 5,
    marginTop: 5,
    borderRadius: 10,
  },
  image: {
    width: 70,
    height: 70,
    alignItems: 'flex-start',
    borderRadius: 10,
  },
  text: {
    paddingLeft: 30,
    fontSize: 15,
  },
})

export default Follower;