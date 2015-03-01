// Used by room.jade. This JS renders a Chat App for every chat room.
// TODO: Implement username
var socket = io();
var roomName = $('#roomName').text();
var username = $('#username').text();
var limit = 200;
var uiLimit = 30;
var initialData;
// Seconds since Unix Epoch
function getCurrUnixTime() {
    return Math.floor((new Date().getTime()) / 1000);
}

var ChatApp = React.createClass({
    getInitialState: function() {
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
                this.trimMessagesStateIfNecessary();
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
    // Detected a new message from SocketIO
    messageRecieve: function(msgInfo) {
        if (msgInfo.chatRoom === roomName) {
            // Create a new msgInfo for this current React app
            var newMsg = {
                msg: msgInfo.msg,
                user: msgInfo.user,
                unix_time: msgInfo.unix_time
            };

            // Here we are concatenating the new emitted message into our ChatApp's messages list
            var messages = this.state.messages;
            var newMessages = messages.concat(newMsg);
            this.setState({messages: newMessages});
            this.trimMessagesStateIfNecessary();
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
    render: function() {
        var messageNodes = this.props.messages.map(function(msg) {
            return (<Message msg={msg} />);
        });
        return (
            <ul className='messagesList'>
                {messageNodes}
            </ul>
        );
    }
});

var Message = React.createClass({
    render: function() {
        var msg = this.props.msg;
        return (
            <li className='message'>{msg.user}: {msg.msg}</li>
        );
    }
});

var ChatForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();

        // The DOM node for <input> chat message
        var msgDOMNode = this.refs.msg.getDOMNode();

        var msgInfo = {
            chatRoom: roomName,
            msg: msgDOMNode.value,
            user: username,
            unix_time: getCurrUnixTime()
        };

        socket.emit('chat message', msgInfo);
        msgDOMNode.value = '';
    },
    render: function() {
        return (
            <form className='chatForm' onSubmit={this.handleSubmit}>
                <input type='text' placeholder='Say something...' ref='msg'/>
                <input type='submit' />
            </form>
        );
    }
})

React.render(
    <ChatApp uiLimit={uiLimit}/>,
    document.getElementById('app')
);
