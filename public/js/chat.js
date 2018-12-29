var socket = io();

var locationBtn = $('#send-location');
var messageForm = $('#message-form');

function scrollToBottom() {
    var messages = $('#messages');
    var newMessage = $('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {

        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
    var template = $('#people-template').html();
    var html = Mustache.render(template, { users});

    $('#users').html(html);
});

socket.on('newMessage', function (message) {
    var foramtedDate = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: foramtedDate
    })

    
    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var foramtedDate = moment(message.createdAt).format('h:mm a');
    var template = $('#message-location-template').html();

    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: foramtedDate
    })

    $('#messages').append(html);
    scrollToBottom();
});

messageForm.on('submit', function (e) {
    e.preventDefault();
    
    var input = $('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: input.val()
    }, function () {
        input.val('');
    });
});

locationBtn.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    locationBtn.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

        locationBtn.removeAttr('disabled').text('Send location');
    }, function () {
        alert('Unable to fetch location.');
        locationBtn.removeAttr('disabled').text('Send location');
    });
});