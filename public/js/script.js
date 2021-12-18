
let chusers = {};
var socket = io();

socket.on("connect-client", (chusers) => {
  console.log(chusers);
});
socket.on("chat-users", (chusers) => {
  console.log(chusers);
});

let newMsgNum = 0;
var sendImg = document.getElementById("send-img");
var sendButton = document.getElementById("send-message");
var messageInput = document.getElementById("messageInput");
var reciver = document.getElementById("reciver") ?? " ";
var myname = document.getElementById("myname");
var sender = document.getElementById("sender");
var myId = document.getElementById("myId");
socket.on("new img msg", (data) => {
  $("#messages").load(window.location.href + " #messages");
  const theElement = document.getElementById('messages');

  theElement.scrollTop = theElement.scrollHeight;
})
socket.on("new message", (data) => {
  newMsgNum++;
  console.log(data);
  if (data.sender == reciver.value && data.reciver == myId.value) {
    var messages_div = document.getElementById("messages");
    var liatr = document.createElement("li");
    liatr.classList.add("friendMsg");
    liatr.innerHTML = `<img src="/files/admin-file-${data.sender}.jpeg" class="avatar" style="vertical-align: middle;float: left;"><div class="friendMsgSeg"> <p>${data.message}</p></div>`;
    messages_div.appendChild(liatr);
      const theElement = document.getElementById('messages');
      const scrollToBottom = (node) => {
          node.scrollTop = node.scrollHeight;
      }
      scrollToBottom(theElement);
  };
  if (data.reciver == myId.value) {
    let lis = document.getElementById(`${data.sender}`);
    console.log(lis);
    var chat_item = document.getElementById("chat_item");
    chat_item.innerHTML = `<i class="icon comment"></i> Chat<div class="ui small red label"> ${newMsgNum}</div>`;
    $("#room-list").load(window.location.href + " #room-list");
  }
});

sendButton.addEventListener("click", () => {
  socket.emit("new message", {
    sender: sender.value,
    username: myname.value,
    message: `${messageInput.value}`,
    reciver: reciver.value,
  });
});
const emitDeleteChat = (chatRoom) => {
  socket.emit("chat delete", {room: chatRoom})
}

sendImg.addEventListener('click', () => {
  $('.img.modal')
  .modal('show').modal({
  });
});
const imgSend = document.getElementById("imgSend");
imgSend.addEventListener('click', () => {
  socket.emit('new img msg', {
     sender: sender.value,
    username: myname.value,
    message: "poslal obrazek",
    reciver: reciver.value,
  })
})