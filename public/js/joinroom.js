var ChatRoomsList = React.createClass({
    render: function() {
        return (
            <div className="chatRoomList">

            </div>
        );
    }
});

var ChatRoom = React.createClass({
    render: function() {
        return (
            <div>
            </div>
        );
    }
});

React.render(
    <ChatRoomsList />,
    document.getElementById('chatRoomList')
);
