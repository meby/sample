// send message to user app server
function send(msg) {
    window.parent.postMessage('TO_USER_SERVER ' + msg, '*');
}

const CMD_FUNCS = {
    'enter': cmdEnter,
    'chat': cmdChat
};

// dispatch messages from server
function receiveMessage(event) {
    let ary = split(event.data, ' ', 2);
    let cmd = ary[0];
    let line = ary[1];

    let func = CMD_FUNCS[cmd];
    if (func != null) {
        func(line);
    }
}

function cmdEnter(line) {
    $('#log').append('入室しました。<br>');
}

function cmdChat(line) {
    $('#log').append(line + '<br>');
}

function attachEventHandlers() {
    $('#chat_text').keydown(function(e) {
        if (e.keyCode != 13) {
            return true;
        }
        
        let text = $('#chat_text').val();
        $('#chat_text').val('');
        send('chat ' + text);
        
        return false;
    });
}

// split('a b c d e', ' ', 3) -> ['a', 'b', 'c d e']
function split(str, delimiter, limit) {
    let strs = [];
    
    while (limit - 1 > 0) {
        let idx = str.indexOf(delimiter);
        if (idx == -1) {
            break;
        }
 
        strs.push(str.substring(0, idx));
        str = str.substring(idx + 1);
 
        limit--;
    }
    strs.push(str);
 
    return strs;
}

$(window).on('load', function() {
    attachEventHandlers();

    window.addEventListener('message', receiveMessage, false);

    send('loaded');
});
