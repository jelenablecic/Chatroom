export class Chatroom {
  // konstruktor
  constructor(r, un) {
    this.room = r;
    this.username = un;
    this.chats = db.collection("chats");
    this.unsub = false;
  }
  //Room set i get
  set room(r) {
    this._room = r;
  }
  get room() {
    return this._room;
  }

  // Username set get
  set username(un) {
    let trim = un.trim();
    if (trim.length >= 2 && trim.length <= 10) {
      this._username = trim;
    }
  }

  get username() {
    return this._username;
  }

  // Metod update room
  updateRoom(newRoom) {
    this.room = newRoom;
    if (this.unsub != false) {
      this.unsub();
    }
  }

  //Metod dodavanje nove poruke
  async addChats(message) {
    let date = new Date();
    let docChat = {
      message: message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(date),
    };

    let response = await this.chats.add(docChat);
    return response;
  }

  //Metod promena u bazi

  getChats(callback) {
    this.unsub = this.chats
      .where("room", "==", this.room)
      .orderBy("created_at", "asc")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            callback(change.doc);
          }
        });
      });
  }

  //Metod update username
  updateUsername(newUser) {
    this.username = newUser;
  }
}
