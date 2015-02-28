// Used by room.jade
var socket = io();
$('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg) {
    $('messages').append($('<li>').text(msg));
});

var roomName = $('#roomName').text();
var limit = 20;
console.log('roomName = ' + roomName);

var ChatApp = React.createClass({
    getInitialState: function() {
        return {messages: []};
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

var ChatForm = React.createClass({
    render: function() {
        return (
            <form>
                <input type='text' placeholder='Say something...' />
                <button type='submit'>Submit</button>
            </form>
        );
    }
})

React.render(
    <ChatApp />,
    document.getElementById('app')
);
