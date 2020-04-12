<template>
  <div>
    <main>
      <h3>welcome to chatroom {{chatId}}</h3>

      <User #user="{user}">
        <div v-if="user">
          <ul>
            <li v-for="message of messages" :key="message.id">
              <ChatMessage :message="message" :owner="user.uid === message.sender" />
            </li>
          </ul>
          <input v-model="newMessageText" class="input" />
          <h5>Record Audio</h5>

          <button v-if="!recorder" @click="record()" class="button is-info">Record Voice</button>
          <button v-else @click="stop()" class="button is-danger">Stop</button>
          <br />
          <audio :src="newAudioUrl" v-if="newAudio" controls></audio>
          <hr />
          <div>Logged in as userid: {{user.uid}}</div>
          <button
            :disabled="!newMessageText || loading"
            class="button is-success"
            type="text"
            @click="addMessage(user.uid)"
          >Send</button>
        </div>
      </User>
      <div v-if="errorMessage">Error message: {{errorMessage}}</div>
    </main>
  </div>
</template>

<script>
import User from "./User";
import ChatMessage from "./ChatMessage";
import { db, storage } from "../firebase";

export default {
  components: {
    User,
    ChatMessage
  },
  data() {
    return {
      newMessageText: "",
      loading: false,
      messages: [],
      errorMessage: "",
      newAudio: null,
      recorder: null
    };
  },
  firestore() {
    return {
      messages: this.messageCollection.orderBy("createdAt").limitToLast(10)
    };
  },
  methods: {
    async addMessage(uid) {
      this.loading = true;
      let audioUrl = null;

      const { id: messageId } = this.messageCollection.doc();

      if (this.newAudio) {
        const storageRef = storage
          .ref("chats")
          .child(this.chatId)
          .child(`${messageId}.wav`);

        await storageRef.put(this.newAudio);
        audioUrl = await storageRef.getDownloadURL();
      }

      console.log(" ==> user", this.user);

      try {
        await this.messageCollection.doc(messageId).set({
          text: this.newMessageText,
          sender: uid,
          createdAt: Date.now(),
          audioUrl
        });
      } catch (error) {
        this.errorMessage = error;
      }

      this.loading = false;
      this.newMessageText = "";
      this.newAudio = null;
    },
    async record() {
      this.newAudio = null;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      const options = { mimeType: "audio/webm" };
      const recordedChunks = [];

      this.recorder = new MediaRecorder(stream, options);
      this.recorder.addEventListener("dataavailable", e => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });

      this.recorder.addEventListener("stop", () => {
        this.newAudio = new Blob(recordedChunks);
        console.log(" ==>", this.newAudio);
      });
      this.recorder.start();
    },
    async stop() {
      this.recorder.stop();
      this.recorder = null;
      this.newMessageText = 'voice message added';
    }
  },
  computed: {
    chatId() {
      return this.$route.params.chatId;
    },
    newAudioUrl() {
      return URL.createObjectURL(this.newAudio);
    },
    userId() {
      return this.$route.params.userId;
    },
    messageCollection() {
      console.log(
        " ==> messageCollection :",
        db.doc(`chats/${this.chatId}`).collection("messages")
      );
      return db.doc(`chats/${this.chatId}`).collection("messages");
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-width: 500px;
  background: #efefef;
  padding: 10px;
  border-radius: 0;
}
li {
  display: flex;
}
</style>