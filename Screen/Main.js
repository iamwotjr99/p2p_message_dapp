import WebviewCrypto from 'react-native-webview-crypto';
import 'react-native-get-random-values';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import "gun/lib/mobile.js";
import GUN from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Store from 'gun/lib/ras.js';

import DesignButton from '../Components/DesignButton'

const asyncStore = Store({AsyncStorage});

// const gun = GUN({
//   peers: ['http://203.247.240.236:8765/gun'],
//   store: asyncStore,
// })

const gun = GUN({
  peers: ['http://localhost:8000/gun'],
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

function Main({navigation}) {
  const [roomState, setRoom] = useState("");
  const [userForm, setUserForm] = useState({
    alias: "",
    password: "",
  });
  const [alias, setAlias] = useState('');

  const clearStorage = () => {
    AsyncStorage.clear();
  };

  useEffect(() => {
    if(gun.user().is) {
        gun.user(gun.user().is.pub).once((res) => {
            console.log("userInfo for pub", res);
            setAlias(res.alias);
        });
    }
  }, [])

  const createUser = () => 
    new Promise((resolve, reject) => {
        console.log('start login');
        console.log(userForm.alias, userForm.password);
        gun.user().create(userForm.alias, userForm.password, async res => {
            console.log('Gun user created result:', res);
            resolve(true);
        })
    })
  

  const authUser = () => 
    new Promise((resolve, reject) => {
        gun.user().auth(userForm.alias, userForm.password, async res => {
            console.log('Gun user auth result: ', res, res.put.alias);
            console.log('pair: ', res.sea);
            if(!res.err) {
              setAlias(res.put.alias);
              navigation.navigate("Ready", {
                  alias: res.put.alias,
              });
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

  const LogoutBtn = async () => {
    console.log('logout btn Click');
    await logoutUser();

    window.location.reload();
    console.log('logout');
}

const EntranceBtn=()=>{
    console.log(roomState)
    navigation.navigate("Chat", {
        alias:alias,
        roomState: roomState,
    });

}

  return(<>
    {gun.user().is?
    <View style={styles.main} >
        <Text>Welcome! {alias}</Text>
        <DesignButton text="Logout" buttonFunction={() => LogoutBtn()} width="30%" height="8%" bgcolor="grey" color={"black"} outline={false}/>
        <TextInput  style={styles.input} type="text" placeholder="Room Number" name="Roomnumber" onChangeText={(e) => onChangeRoomHandler("RoomState", e)}/>
        <DesignButton text="Entrance" buttonFunction={() => EntranceBtn()} width="30%" height="8%" bgcolor="grey" color={"black"} outline={false} />
    </View>
    
    :
    <View style={styles.main}>
      <WebviewCrypto />
      <TextInput  style={styles.input} type="text" placeholder="ID" name="alias" onChangeText={(e) => onChangeHandler("alias", e)}/>
      <TextInput  style={styles.input} type="password" placeholder="Password" name="password" secureTextEntry={true} onChangeText={(e) => onChangeHandler("password", e)}/>
      <DesignButton text="Login" buttonFunction={loginBtn} width="30%" height="8%" bgcolor="grey" color={"black"} outline={false} />
      <DesignButton text="SignUp" buttonFunction={() => signUpBtn()} width="30%" height="8%" bgcolor="grey" color={"black"} outline={false} />
    </View>
    }
      </>)
}

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

export default Main
