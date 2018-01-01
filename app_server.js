'use strict';

const request = require('request');
const meby = require('./meby');

const HTTP_PORT = 8080;
const TCP_PORT = 3030;

// app data
const CMD_FUNCS = {
    'loaded': cmdLoaded,   // 入室時
    'chat': cmdChat        // アプリ内チャット
}

// dispatch messages from app clients for each command
function onMsg(username, sid, msg) {
    let ary = meby.split(msg, ' ', 2);
    let cmd = ary[0];
    let line = ary[1];
 
    let func = CMD_FUNCS[cmd];
    if (func != null) {
        func(username, sid, line);
    }
}
 
function cmdLoaded(username, sid, line) {
    meby.sendBySid(sid, 'enter');
}

function cmdChat(username, sid, line) {
    meby.sendAll('chat ' + username + ' > ' + line);
}

function main() {
    meby.startWebServer(HTTP_PORT);

    meby.setMsgFunction(onMsg);
    meby.startAppServer(TCP_PORT);
}

main();
