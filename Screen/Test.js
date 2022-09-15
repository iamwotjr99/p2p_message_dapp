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
  

function Test({navigation}) {
    const [roomState, setRoom] = useState("");
    const [userForm, setUserForm] = useState({
      alias: "",
      password: "",
    });
    const [alias, setAlias] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    
  //스토리지 삭제시 useEffect에 넣어서 정리해주기
    const clearStorage = () => {
        //androidd에서만 가능
        //AsyncStorage.clear()
        //ios에서만 가능
        //AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)
    };
  
    useEffect(() => {
        clearStorage()
      if(gun.user().is) {
          gun.user(gun.user().is.pub).once((res) => {

              setAlias(res.alias);
          });
      }
    }, [])
  
    const createUser = () => 
      new Promise((resolve, reject) => {
          console.log('start login');
          console.log(userForm.alias, userForm.password);
          gun.user().create(userForm.alias, userForm.password, async res => { 
              resolve(true);
          })
      })
    
  
    const authUser = () => 
      new Promise((resolve, reject) => {
          gun.user().auth(userForm.alias, userForm.password, async res => {

              if(!res.err) {
                setAlias(res.put.alias);
                setIsLogin(true);
                resolve({user: gun.user().pair(), err: res.err});
              } else {
                window.alert(res.err);
                resolve({user: gun.user().pair()});
              }
          })
      })
    
  
    const signUpBtn = async () => {
      const getElapsed = timer();
      await createUser();
      console.log('created', getElapsed());
    }
  
    const loginBtn = async () => {
      const getElapsed = timer();
      await authUser();
      console.log('authenticated', getElapsed());
      setUserForm({
        alias: "",
        password: "",
      })
    }
    
    const LogoutBtn = async () => {
      console.log("Hello")
      console.log("before logout sea: ", gun.user()._.sea)
      gun.user().leave();
      console.log("after logout sea: ", gun.user()._.sea);
      setIsLogin(false);
    }
    const onChangeHandler = (keyValue, e) => {
      setUserForm({
        ...userForm,
        [keyValue]: e,
      })
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
  
    return(<><WebviewCrypto />
      {isLogin ?
      <View style={styles.home} >
        <Text style={styles.Textsize1}>P2P Messenger {"\n"}{"\n"}</Text>
        <View style={styles.row}>
          <Text style={styles.Textsize2}>Welcome! {alias}  </Text>
          <DesignButton text="Logout" buttonFunction={() => LogoutBtn()} width="30%" height="30%" bgcolor="grey" color={"black"} outline={false}/>
        </View>
        
          <TextInput  style={styles.input} type="text" placeholder="Room Number" value={roomState} name="Roomnumber" onChangeText={(e) => onChangeRoomHandler("RoomState", e)}/>
          <DesignButton text="Entrance" buttonFunction={() => EntranceBtn()} width="30%" height="5%" bgcolor="grey" color={"black"} outline={false} />
      </View>
      
      :
        
        <View style={styles.home}>
        <Text style={styles.Textsize1}>P2P Messenger {"\n"}{"\n"}</Text>
        <TextInput  style={styles.input} type="text" placeholder="ID" name="alias" value={userForm.alias} onChangeText={(e) => onChangeHandler("alias", e)}/>
        <TextInput  style={styles.input} type="password" placeholder="Password" value={userForm.password} name="password" secureTextEntry={true} onChangeText={(e) => onChangeHandler("password", e)}/>
        <DesignButton text="Login" buttonFunction={() =>loginBtn()} width="30%" height="5%" bgcolor="grey" color={"black"} outline={false} />
        <DesignButton text="SignUp" buttonFunction={() => signUpBtn()} width="30%" height="5%" bgcolor="grey" color={"black"} outline={false} />
      </View>
   
      }
        </>)
  }
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

  export default Test;