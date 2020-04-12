<template>
  <div>
    <ul>
      <li v-for="chat in chats" :key="chat.id">
        <router-link :to="{ name:'chat' ,params:{chatId:chat.id}}">{{chat.id}} {{ myRoom(chat)}}</router-link>
      </li>
    </ul>

    <button @click="createChatRoom()">Create new chat room</button>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  data() {
    return { chats: [] };
  },
  firestore() {
    return { chats: db.collection("chats") }; //.where('owner','==',this.uid)}
  },
  methods: {
    async createChatRoom() {
      const newChat = await db.collection("chats").add({
        createdAt: Date.now(),
        owner: this.uid,
        members: [this.uid]
      });

      console.log(" ==> newChat", newChat);
    },
     myRoom(chat){
          return chat.owner === this.uid?'My room':'';
      }
  },
  computed:{
     
  },
  props: ["uid"]
};
</script>

<style>
</style>