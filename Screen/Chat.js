import React, {useState,useEffect,useReducer} from 'react';
import CryptoJS from "crypto-js";
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, Text,TextInput,StyleSheet,ScrollView, Alert} from 'react-native';
import { Header } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import WebviewCrypto from 'react-native-webview-crypto';
import 'react-native-get-random-values';
import "gun/lib/mobile.js";
import GUN from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Store from 'gun/lib/ras.js';



const asyncStore = Store({AsyncStorage});

// const gun = GUN({
//   peers: ['http://203.247.240.236:8765/gun'],
//   store: asyncStore,
// })

const gun = GUN({
    peers: ['http://localhost:8000/gun'],
    store: asyncStore,
  })

const initialState = {
   messages: [],
};

const reducer = (state, message) => {
    return {
      messages: [message, ...state.messages],
    };
  };

function Chat({route,navigation}){
    const {alias}=route.params
    const {roomState}=route.params
    console.log(alias)
    console.log(roomState.RoomState)

    const [state, dispatch] = useReducer(reducer, initialState);
    const [originalhash, setoriginalhash] = useState("");
    const [messageState, setMessage] = useState("");

    useEffect(() => {
      console.log("useEffect Hook 😆");
      const messages = gun.get(roomState.RoomState);
      console.log("messages: " , messages)
      messages.map().once((m) => {
        console.log(m);
        dispatch({
          name: m.name,
          message: m.message,
          createdAt: m.createdAt,
        });
      });
      onHashMessage();
    }, [roomState.RoomState]);

    const onChange = (keyvalue,e) => {
      console.log(keyvalue,e)
      setMessage(e)

    }   

    function Back(){
      navigation.navigate('Ready',{
      alias: alias
      })
    }

    const saveMessage= () => {
        const messages = gun.get(roomState.RoomState);
        messages.set({
          name: alias,
          message: messageState,
          createdAt: Date().toLocaleString(),
        });
        setMessage(" ");
    }


    //블록체인에 총 메세지의 해쉬값 전달 완성
    const onHashMessage = async () => {
    const wholemessages = gun.put(roomState.RoomState);
    console.log(wholemessages._.graph)
    //Recording on message 버튼 클릭 당시의 메세지들의 해쉬값
    const hash=CryptoJS.SHA256(JSON.stringify(wholemessages._.graph)).toString()
    //그 전의 메세지들의 해쉬값(블록체인에 저장되어있는 해쉬값)
    //그전의 메세지와 현대 메세지가 동일할경우, 그전의 메세지의 값이 존재하지 않는경우 트랜잭션 발생
    if(originalhash!==hash){
        //호스트 아이디를 로그인방식을 만들어서 해결할지 --> 진행중
        axios.post(`http://203.247.240.236:1206/api/recordhash`, {
        "RoomNumber":roomState.RoomState,
        "PostID": alias,
        "DateTime":Date().toLocaleString(),
        "Hash":hash
        }).then((res) => {
        onQuery()
        window.alert("Hash Recorded: \n"+res.data.Hash);
        console.log(res.data.hash);
    });
    }
    }

    //처음 개설된 방도 해쉬값을 저장(처음개설된 방은 빈값이 저장)/ 원래 개설되어있던 방은 블록체인에 있는 해쉬값 가져와서 저장
    function onQuery(){
        axios.get(`http://203.247.240.236:1206/api/query/${roomState.RoomState}`).then((res) => {
            console.log(res)
            setoriginalhash(res.data.hash);
        });
    }

    //블록체인에 저장되어있는 해쉬값 호출
    function onChainQuery(){
        console.log(roomState.RoomState)
        const wholemessages = gun.put(roomState.RoomState);
        console.log(wholemessages._.graph)
        //Recording on message 버튼 클릭 당시의 메세지들의 해쉬값
        const hash=CryptoJS.SHA256(JSON.stringify(wholemessages._.graph)).toString()
        axios.get(`http://203.247.240.236:1206/api/query/${roomState.RoomState}`).then((res) => {
            res.data.hash == undefined ? 
            Alert.alert("No Recorded Hash \n Now Hash \n" + hash) : 
            Alert.alert('✏️ ' + res.data.postid + "Recorded Hash at " + res.data.dateTime + '\n' + res.data.hash + "\n \n 🔎 Now Hash \n" + hash);
        });
    }


      return(
        <View style={styles.home}>
            <Header
            backgroundColor='grey'
            leftComponent={<TouchableOpacity onPress={Back}><Ionicons name="chevron-back-outline" size={30} color="black" /></TouchableOpacity>}
            centerComponent={{ text:roomState.RoomState,style:{width:200,fontSize:30,fontWeight: 'bold'}}}
            rightComponent={<View style={styles.row}>
                            <TouchableOpacity onPress={onHashMessage}>
                            <Ionicons name="save-outline" size={30} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={onChainQuery}>
                            <Ionicons name="checkbox-outline" size={30} color="black" />
                            </TouchableOpacity>
                            </View>}
            />
            <View style={styles.main}>
                <ScrollView style={styles.main}>
                    {state.messages.map((message, createdAt) => (
                        <View style={styles.message} key={createdAt}>
                            <Text>{message.name}</Text>
                            <Text>{message.message}</Text>
                            <Text>{message.createdAt}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.row}>
                    <TextInput style={styles.Chatinput} type="text" placeholder="My message" value={messageState} onChangeText={(e) => onChange("messageState",e)}/>
                    <TouchableOpacity onPress={()=> saveMessage()}>
                    <Ionicons name="send" size={30} color="black"></Ionicons>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      )
}

export default Chat;


const styles = StyleSheet.create({
  home:{
    flexDirection:"center",
    justifyContent: "center",
    backgroundColor:"grey",
    width:"100%",
    height:"100%"
},
main:{
  marginTop:"2%",
  marginLeft:"2%",
  height:"90%",
  width:"95%",
  
},
message:{
  marginTop:"2%",
},
  Roominput:{
    width:"80%",
    height:"10%",
    marginTop: "4%",
    marginLeft:"4%",
    marginRight:"4%",
    borderWidth: 1,
    padding: 10,
  },
    Chatinput:{
        width:"80%",
        height:"90%",
        marginTop: "2%",
        marginLeft:"2%",
        marginRight:"2%",
        borderWidth: 1,
        padding: 10,
      },
    row:{ 
      marginBottom:"2%",
      backgroundColor:"grey",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",

      },
   
  });