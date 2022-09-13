import React, {useState,useEffect,useReducer} from 'react';
import {View, Text,TextInput,StyleSheet,ScrollView} from 'react-native';
import DesignButton from '../Components/DesignButton';

import WebviewCrypto from 'react-native-webview-crypto';
import 'react-native-get-random-values';

function Ready({route,navigation}){
    const {alias}=route.params;
    
    const [roomState, setRoom] = useState("");

    const onChangeRoomHandler = (keyvalue,e) => {
        setRoom({
            [keyvalue]: e,
        })
    }
      

    const LogoutBtn = async () => {
        console.log('logout btn in ready');
        // navigation.goBack();
        console.log('logout');
    }

    const EntranceBtn=()=>{
        console.log(roomState)
        navigation.navigate("Chat", {
            alias:alias,
            roomState: roomState,
        });

    }

    return(
    <View style={styles.main}>
        <WebviewCrypto />
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