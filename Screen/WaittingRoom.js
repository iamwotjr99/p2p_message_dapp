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

  const timer = () => {
    let current = Date.now();
    return () => {
      const res = `${(Date.now() - current) / 1000} seconds`;
      current = Date.now();
      return res;
    };
  };
  

function WaittingRoom({route,navigation}) {
    const [roomState, setRoom] = useState("");
    const {alias}=route.params;
    const {password}=route.params;
    console.log(alias,password)

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
  
    const onChangeRoomHandler = (keyValue, e) => {
      setRoom({
        [keyValue]: e,
      })
    }

    const EntranceBtn=()=>{
        navigation.navigate('Chat', {
            alias:alias,
            roomState: roomState,
        });
    }
  
    return(<>
      <View style={styles.home} >
        <Text style={styles.Textsize1}>P2P Messenger {"\n"}{"\n"}</Text>
        <View style={styles.row}>
          <Text style={styles.Textsize2}>Welcome! {alias}  </Text>
          <DesignButton text="Logout" buttonFunction={() => LogoutBtn()} width="30%" height="30%" bgcolor="grey" color={"black"} outline={false}/>
        </View>
        
          <TextInput  style={styles.input} type="text" placeholder="Room Number" value={roomState} name="Roomnumber" onChangeText={(e) => onChangeRoomHandler("RoomState", e)}/>
          <DesignButton text="Entrance" buttonFunction={() => EntranceBtn()} width="30%" height="5%" bgcolor="grey" color={"black"} outline={false} />
      </View>
      
      
        </>)
  }
  export default WaittingRoom;

  const styles = StyleSheet.create({
    home:{
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:"grey",
      width:"100%",
      height:"100%"
    },
    Textsize1:{
      fontSize:40,
      fontWeight: 'bold'
    },
    Textsize2:{
      fontSize:18,
      fontWeight: 'bold'
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
    row:{ 
      width:"60%",
      backgroundColor:"grey",
      flexDirection:"row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
    },
  });