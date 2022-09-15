function Message({message, name}) {
    const messageState = message.name === name ? 'sender' : 'receiver';

    return (
        <div className={`message_${messageState}`}>
            <div className="message_name">{message.name}</div>
            {messageState === 'sender' ? 
                <div className="message_column">
                    <div className="message_time">{message.createdAt}</div>
                    <div className="message_content">{message.message}</div>
                </div> : 
                <div className="message_column">
                    <div className="message_content">{message.message}</div>
                    <div className="message_time">{message.createdAt}</div>
                </div>
            }
        </div>
    )
}

export default Message;