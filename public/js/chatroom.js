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

var ChatApp = React.createClass({
    return (
        <div className="chatApp">
            Hello world
        </div>
    );
});

React.render(
    <ChatApp />,
    document.getElementById('app')
);
