// Used by room.jade. This JS renders a Chat App for every chat room.
var socket = io();
var roomName = $('#roomName').text();
var username = $('#username').text();
var limit = 200;
var uiLimit = 100;
var maxChatMessageLength = '400';
var timeZoneOffsetHours = new Date().getTimezoneOffset() / 60;

// Seconds since Unix Epoch. Used to convert between the database
// timestamp and client JS timestamp. However it is much easier to
// just do it in postgresql queries, as they have a lot of good 
// date/time functions.
function getCurrUnixTime() {
    return Math.floor((new Date().getTime()) / 1000);
}

function convertToHHMI(unix_time) {
    var days = Math.floor(unix_time / 86400);
    var hours = Math.floor((unix_time - (days * 86400)) / 3600);
    var minutes = Math.floor((unix_time - ((hours * 3600) + (days * 86400))) / 60);
    hours -= timeZoneOffsetHours;
    if (hours < 0) {
        hours = 24 + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }

    return hours + ':' + minutes;
}

// Flux Architecture
// ChatApp is the central state store. Notice that all other React
// components use props, not state. Whenever a state in ChatApp changes
// usually by recieving a socket message from other user, the props
// are updated automatically by React.js. This makes development simple,
// as ChatApp is the only React component that is dynamic.
var ChatApp = React.createClass({
    getInitialState: function() {
        // Handle socket chat message from other users
        socket.on('chat message', this.messageRecieve);
        return {messages: []};
    },
    componentDidMount: function() {
        // On ChatApp load, grab message history of current chat room from the /messages API
        $.ajax({
            url: '/messages/?chatroom=' + roomName +'&limit=' + limit,
            dataType: 'json',
            success: function(data) {
                this.setState({messages: data});
                // this.trimMessagesStateIfNecessary();
            }.bind(this),
            failure: function(xhr, status, err) {
                console.err(url, status, err.toString());
            }.bind(this)
        });
    },
    trimMessagesStateIfNecessary: function() {
        var messages = this.state.messages;
        var messagesLength = messages.length;
        var appUiLim = this.props.uiLimit;

        if (appUiLim < messagesLength) {
            messages.splice(0, messagesLength - uiLimit);
        }

        this.setState({messages: messages});
    },
    // Called when app detects a new message from SocketIO
    messageRecieve: function(msgInfo) {
        if (msgInfo.room_name === roomName) {
            // Create a new msgInfo for this current React app

            // Hour:Minute time
            var HHMITime = convertToHHMI(msgInfo.unix_time);
            var newMsg = {
                username: msgInfo.username,
                msg: msgInfo.msg,
                time: HHMITime
            };

            // Here we are concatenating the new emitted message into our ChatApp's messages list
            var messages = this.state.messages;
            var newMessages = messages.concat(newMsg);
            this.setState({messages: newMessages});
            // this.trimMessagesStateIfNecessary();
        }
    },
    render: function() {
        return (
            <div className='chatApp'>
                <MessagesList messages={this.state.messages}/>
                <ChatForm />
            </div>
        );
    }
});

var MessagesList = React.createClass({
    componentDidMount: function() {
        var messagesList = this.refs.messagesList.getDOMNode();
    },
    render: function() {
        var messageNodes = this.props.messages.map(function(msg) {
            return (<Message msg={msg} />);
        });

        return (
            <ul className='messagesList' ref='messagesList'>
                {messageNodes}
            </ul>
        );
    }
});

var Message = React.createClass({
    componentDidMount: function() {
        var messageDOM = this.refs.message.getDOMNode();
        messageDOM.scrollIntoView();
    },
    render: function() {
        var msg = this.props.msg;
        return (
            <li className='message' ref='message'>
                <span className='messageTime'>{msg.time} </span>
                <b className='username'>{msg.username}</b> 
                <span className='messageText'>: {msg.msg}</span>
            </li>
        );
    }
});

var ChatForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();

        // The DOM node for <input> chat message
        var msgDOMNode = this.refs.msg.getDOMNode();
        
        if (msgDOMNode.value === '') {
            return;
        }

        var msgInfo = {
            room_name: roomName,
            msg: msgDOMNode.value,
            username: username,
            unix_time: getCurrUnixTime()
        };

        socket.emit('chat message', msgInfo);
        msgDOMNode.value = '';
    },
    render: function() {
        return (
            <form className='chatForm' onSubmit={this.handleSubmit}>
                <input className='input_field chat_input_field' type='text' maxLength={maxChatMessageLength} placeholder='Say something...' ref='msg'/>
            </form>
        );
    }
})

React.render(
    <ChatApp uiLimit={uiLimit}/>,
    document.getElementById('app')
);

