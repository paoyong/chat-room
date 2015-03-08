var loggedInAs;
var socket = io();
function updateLogInInfo(username) {
    $('#loginMessage').text('Logged in as ' + username + '.');
}

$.ajax({
    url: '/login',
    success: function(username) {
        loggedInAs = username;
        if (loggedInAs) {
            updateLogInInfo(loggedInAs);
        }
    }
});

$('form').submit(function(e) {
    e.preventDefault();
    var val = $('#username').val();
    console.log(val);
    if (val === '') {
        return;
    }
    var data = {
        username: val
    };
    $.ajax({
        type: 'POST',
        url: '/login',
        data: data,
        success: function() {
            updateLogInInfo(data.username);
            $('#username').val('');
            $('#username').blur();
        }
    });
});

var App = React.createClass({
    getInitialState: function() {
        socket.on('user connected', this.handleConnection);
        socket.on('user disconnected', this.handleConnection);
        return {rooms: [], peopleOnline: 0};
    },
    handleConnection: function(peopleOnline) {
        console.log('Hello from React, ' + peopleOnline + ' people are online!');
        this.setState({peopleOnline: peopleOnline});
    },
    componentDidMount: function() {
        $.ajax({
            url: '/chatrooms',
            dataType: 'json',
            success: function(data) {
                this.setState({rooms: data});
            }.bind(this)
        });
    },
    onChatRoomSubmit: function(roomName) {
        var rooms = this.state.rooms;
        var newRooms = rooms.concat(roomName);
        $.ajax({
            type: 'POST',
            url: '/chatrooms/insert',
            data: {
                roomName: roomName
            },
            success: function() {
                this.setState({rooms: newRooms});
            }.bind(this)
        });
    },
    render: function() {
        return(
            <div className="chatRoomListApp">
            <PeopleOnline peopleOnline={this.state.peopleOnline} />
            <NewChatRoomForm onChatRoomSubmit={this.onChatRoomSubmit} />
            <ChatRoomsList rooms={this.state.rooms} />
            </div>
        );
    }
});

var PeopleOnline = React.createClass({
    render: function() {
        return (
            <p className='peopleOnline'>
            People online right now: <span id='peopleOnlineCount'>{this.props.peopleOnline}</span>
            </p>
        )
    }
})

var ChatRoomsList = React.createClass({
    render: function() {
        var roomNodes = this.props.rooms.map(function(room) {
            return (
                <ChatRoom roomName={room.room_name}/>
            );
        });
        return (
            <ul className="chatRoomList">
                {roomNodes}
            </ul>
        );
    }
});

var ChatRoom = React.createClass({
    render: function() {
        var roomName = this.props.roomName;
        return (
            <li className='room'>
                <a href={'r/' + roomName}>{roomName}</a>
            </li>
        );
    }
});

var NewChatRoomForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var roomName = this.refs.roomName.getDOMNode().value.trim();
        if (!roomName) {
            return;
        }
        this.props.onChatRoomSubmit(roomName);
        this.refs.roomName.getDOMNode().value = '';
    },
    render: function() {
        return (
            <form className='newChatRoomForm' onSubmit={this.handleSubmit}>
                <input className='input_field short_input_field' type='text' placeholder='Create new room...' ref='roomName' />
            </form>
        );
    }
})
React.render(
    <App />,
    document.getElementById('chatRoomList')
);
