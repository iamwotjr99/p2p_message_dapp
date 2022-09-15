import {View, Text, StyleSheet} from 'react-native';

function Message({message, name}) {
    const messageState = message.name === name ? 'sender' : 'receiver';

    return (
        <View>
            <View style="message_name">
                <Text>{message.name}</Text>
            </View>
            {messageState === 'sender' ? 
                <View style="message_column">
                    <View style="message_time">
                        <Text>{message.createdAt}</Text>
                    </View>
                    <View style="message_content">
                        <Text>{message.message}</Text>
                    </View>
                </View> : 
                <View style="message_column">
                    <View style="message_content">
                        <Text>{message.message}</Text>
                    </View>
                    <View style="message_time">
                        <Text>{message.createdAt}</Text>
                    </View>
                </View>
            }
        </View>
    )
}

export default Message;


const styles = StyleSheet.create({
    message_sender: {
        paddingRight: "2%",
        marginLeft: "auto",
    },
    message_receiver: {
        paddingLeft: "2%",
        marginRight: "auto",
    }
})