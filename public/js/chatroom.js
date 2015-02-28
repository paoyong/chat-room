// Used by room.jade
var socket = io();
$('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});


var roomName = $('#roomName').text();
var limit = 200;

var ChatApp = React.createClass({
    getInitialState: function() {
        socket.on('chat message', this.messageRecieve);
        return {messages: []};
    },
    messageRecieve: function(message) {
        // api:  {"msg":"Hello world","user":"keithy","unix_time":1425124813}
        // emit: {chatRoom: "general", username: "keithy", message: "ads", unixTime: 1425157877}
        if (message.chatRoom === roomName) {
            var newMsg = {
                msg: message.message,
                user: message.username,
                unix_time: message.unixTime
            };
            var messages = this.state.messages;
            var newMessages = messages.concat(newMsg);
            this.setState({messages: newMessages});
        }
    },
    componentDidMount: function() {
        $.ajax({
            url: '/messages/?chatroom=' + roomName +'&limit=' + limit,
            dataType: 'json',
            success: function(data) {
                this.setState({messages: data});
            }.bind(this),
            failure: function(xhr, status, err) {
                console.err(url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div className="chatApp">
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
            <ul>
                {messageNodes}
            </ul>
        );
    }
});

var Message = React.createClass({
    render: function() {
        var msg = this.props.msg;
        return (
            <li>{msg.user}: {msg.msg}</li>
        );
    }
});

function getCurrUnixTime() {
    return Math.floor((new Date().getTime()) / 1000);
}
var ChatForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var msgDOMNode = this.refs.msg.getDOMNode();
        var msgInfo = {
            chatRoom: roomName,
            username: 'keithy',
            message: msgDOMNode.value,
            unixTime: getCurrUnixTime()
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
    <ChatApp />,
    document.getElementById('app')
);
