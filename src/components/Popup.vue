<template>
  <v-container>
    <v-layout row justify-center>
      <v-snackbar v-model="snackbar" :timeout="6000" top color="success">
        <span>You added task correctly!</span>
        <v-btn @click="close" color="black">Close</v-btn>
      </v-snackbar>
      <v-dialog v-model="dialog" width="600">
        <template v-slot:activator="{ on }">
          <v-btn x-large rounded color="success" class="ma-4" dark v-on="on">
            <v-icon>add</v-icon>
            Add Task
          </v-btn>
        </template>

        <v-card>
          <v-card-title
            class="headline grey lighten-2 green--text d-flex justify-center"
            primary-title
          >
            Adding Task
          </v-card-title>

          <v-form v-model="valid" ref="form">
            <v-container>
              <v-col>
                <v-col fluid>
                  <v-text-field
                    v-model="title"
                    :rules="titleRules"
                    :counter="50"
                    label="Title"
                    required
                  ></v-text-field>
                </v-col>

                <v-col fluid>
                  <v-text-field
                    v-model="subtitle"
                    :rules="subtitleRules"
                    :counter="80"
                    label="Subtitle"
                    required
                  ></v-text-field>
                </v-col>

                <v-col fluid>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    max-width="290"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :value="computedDateFormattedMomentjs"
                        clearable
                        label="Date"
                        readonly
                        v-on="on"
                        @click:clear="date = null"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      @change="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-col>
            </v-container>
          </v-form>

          <v-divider></v-divider>

          <v-card-actions class="d-flex justify-center">
            <v-spacer></v-spacer>
            <v-btn color="success" @click="submit" :loading="loading">
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import firebase from "../fb";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "Popup",

  components: {},

  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    dialog: false,
    valid: false,
    title: "",
    subtitle: "",
    titleRules: [
      v => !!v || "Title is required",
      v => v.length <= 50 || "Title must be less than 30 characters"
    ],
    subtitleRules: [
      v => v.length <= 80 || "Subtitle must be less than 40 characters"
    ],
    snackbar: false,
    loading: false
  }),

  computed: {
    ...mapGetters({
      user: "user"
    }),
    computedDateFormattedMomentjs() {
      return this.date ? moment(this.date).format("dddd, MMMM Do YYYY") : "";
    }
  },
  methods: {
    close() {
      this.snackbar = false;
    },
    submit() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          if (this.$refs.form.validate()) {
            this.snackbar = true;
            this.loading = true;
            this.dialog = false;
            const todo = {
              title: this.title,
              subtitle: this.subtitle,
              date: moment(this.date).format("dddd, MMMM Do YYYY"),
              miliseconds: moment(this.date).format("x"),
              status: "ongoing"
            };
            this.title = "";
            this.subtitle = "";
            firebase
              .firestore()
              .collection(user.uid)
              .add(todo)
              .then(() => {});
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
