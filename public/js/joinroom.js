var App = React.createClass({
    getInitialState: function() {
        return {rooms: []};
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
    render: function() {
        return(
            <div className="chatRoomListApp">
            <ChatRoomsList rooms={this.state.rooms} />
            </div>
        );
    }

})
var ChatRoomsList = React.createClass({
    render: function() {
        var roomNodes = this.props.rooms.map(function(room) {
            return (
                <ChatRoom roomName={room.name}/>
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

React.render(
    <App />,
    document.getElementById('chatRoomList')
);
