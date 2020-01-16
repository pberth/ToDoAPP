<template>
  <v-container>
    <v-container v-if="loggedIn">
      <v-layout row justify-center>
        <v-flex xs12 sm12 md10 xl8>
          <v-card class="elevation-12" light flat>
            <v-container>
              <v-layout column justify-center>
                <Popup />
                <Tasks />
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container v-else>
      <v-layout row justify-center>
        <h1 class="header">
          Please <span class="text-uppercase green--text">Sign in</span>
        </h1>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import Popup from "../components/Popup";
import Tasks from "../components/Tasks";
import { mapGetters } from "vuex";
import firebase from "firebase";
// @ is an alias to /src
export default {
  name: "home",
  data: () => ({
    loggedIn: false
  }),
  components: {
    Popup,
    Tasks
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.loggedIn = true;
      }
    });
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  }
};
</script>

<style scoped>
.header {
  font-family: "Roboto", sans-serif;
}
</style>
