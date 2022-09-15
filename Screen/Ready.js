//react-native
import WebviewCrypto from 'react-native-webview-crypto';
import 'react-native-get-random-values';

import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import { useState, useEffect, useTransition } from 'react';
import DesignButton from '../Components/DesignButton';

//gunDB
import "gun/lib/mobile.js";
import GUN from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Store from "gun/lib/ras.js";

const asyncStore = Store({AsyncStorage});

const gun = GUN({
    peers: ['http://203.247.240.236:8765/gun'],
    store: asyncStore,
  })

function Ready({route,navigation}){
    const [roomState, setRoom] = useState("");
    const {alias}=route.params;
    const {password}=route.params;
    console.log(alias,password)
    const {pair} = route.params;

    const onChangeRoomHandler = (keyvalue,e) => {
        setRoom({
            [keyvalue]: e,
        })
    }

    const [currentalias, setCurrentAlias] = useState('');
   
    useEffect(() => {
        authUser()
    }, [])
  
    const authUser = () => 
      new Promise((resolve, reject) => {
          gun.user().auth(alias, password, async res => {

              if(!res.err) {
                setCurrentAlias(res.put.alias);
               
                resolve({user: gun.user().pair(), err: res.err});
              } else {
                window.alert(res.err);
                resolve({user: gun.user().pair()});
              }
          })
      })
    
    const LogoutBtn = async () => {
      console.log("before logout sea: ", gun.user()._.sea);
      gun.user().leave();
      console.log("after logout sea:", gun.user()._.sea);
      navigation.navigate('Main');
    }

    const EntranceBtn=()=>{
        console.log(roomState)
        navigation.navigate("Chat", {
            alias:alias,
            roomState: roomState,
            pair: pair
        });

    }

    return(
    <View style={styles.main}>
        <Text>Welcome! {alias}</Text>
        <DesignButton text="Logout" buttonFunction={LogoutBtn} width="30%" height="8%" bgcolor="grey" color={"black"} outline={false}/>
        <TextInput  style={styles.input} type="text" placeholder="Room Number" name="Roomnumber" onChangeText={(e) => onChangeRoomHandler("RoomState", e)}/>
        <DesignButton text="Entrance" buttonFunction={() => EntranceBtn()} width="30%" height="8%" bgcolor="grey" color={"black"} outline={false} />
    </View>
)
}
export default Ready;


const styles = StyleSheet.create({
    main:{
        backgroundColor:"grey",
        height:"100%",
        alignItems: "center", 
        justifyContent: "center",
    },
    Textinput:{
        width:"40%",
        height:40,
        marginTop: 12,
        marginRight:10,
        borderWidth: 1,
        padding: 10,
      },
      input: {
        width:"60%",
        height:40,
        marginTop: 12,
        marginRight:10,
        borderWidth: 1,
        padding: 10,
      },
  });