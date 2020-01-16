<template>
  <v-container>
    <!-- Start of Sorting -->
    <v-row justify="center">
      <v-dialog v-model="dialog" scrollable max-width="300px">
        <template v-slot:activator="{ on }">
          <v-btn color="success" dark v-on="on">Sort by</v-btn>
        </template>
        <v-card>
          <v-card-title>Sort By</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="card_height">
            <v-container>
              <v-layout column>
                <v-btn
                  class="mt-2"
                  small
                  rounded
                  color="grey"
                  @click="sortBy('title')"
                >
                  <v-icon left small> folder </v-icon>
                  <span class="caption text-lowercase">By title</span>
                </v-btn>
                <v-btn
                  class="mt-2"
                  small
                  rounded
                  color="grey"
                  @click="sortBy('status')"
                >
                  <v-icon left small> folder </v-icon>
                  <span class="caption text-lowercase">By status</span>
                </v-btn>
                <v-btn
                  class="mt-2"
                  small
                  rounded
                  color="grey"
                  @click="sortBy('date')"
                >
                  <v-icon left small> folder </v-icon>
                  <span class="caption text-lowercase">By date</span>
                </v-btn>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="done">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- End of Sorting -->
    <!-- Filtering -->
    <div class="filter">
      <div class="filtr">
        <v-icon>search</v-icon>
        <v-text-field v-model="search" label="Search task"></v-text-field>
      </div>
    </div>
    <!-- End of Filtering -->
    <v-list flat class="overflow-y-auto list_height" @click="check(index)">
      <v-list-item-group v-model="model" color="success">
        <v-list-item v-for="(task, index) in filteredTasks" :key="index">
          <v-layout row wrap :class="`pa-3 task ${task.status}`">
            <v-list-item-icon>
              <v-icon>folder</v-icon>
            </v-list-item-icon>
            <v-flex xs12 sm10 md8 lg6>
              <v-list-item-content>
                <v-list-item-title class="d-flex">
                  <h2 class="break">{{ task.title }}</h2>
                </v-list-item-title>
                <v-list-item-subtitle class="d-flex">
                  <h3 class="break">{{ task.subtitle }}</h3>
                </v-list-item-subtitle>
                <v-list-item-subtitle class="d-flex">
                  <h4 class="break">{{ task.date }}</h4>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-flex>
            <v-flex xs12 sm6 md2 lg1 class="center column ma-1">
              <div class="caption">Status</div>
              <div :class="`text ${task.status}`">
                {{ task.status }}
              </div>
            </v-flex>
            <v-flex xs12 sm5 md12 lg4 class="center ma-1">
              <v-btn
                small
                rounded
                color="success"
                :class="`ma-4 update button icon ${task.status}`"
                dark
                @click="check(index)"
              >
                Update
              </v-btn>
              <v-btn-toggle v-model="toggle_exclusive" rounded>
                <v-btn
                  color="success"
                  :class="`button ${task.status}`"
                  @click="complete(index)"
                >
                  <v-icon :class="`icon ${task.status}`">check</v-icon>
                </v-btn>
                <v-btn color="red" @click="remove(index)">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-flex>
            <div class="border"></div>
          </v-layout>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>
<script>
import firebase from "../fb";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  data: () => ({
    toggle_exclusive: undefined,
    tasks: [],
    model: 1,
    dialogm1: "",
    dialog: false,
    search: ""
  }),
  methods: {
    done() {
      this.dialog = false;
    },
    sortBy(prop) {
      this.tasks.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
    },
    remove(index) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          let id = this.tasks[index].i;
          firebase
            .firestore()
            .collection(user.uid)
            .doc(id)
            .delete()
            .then(() => {
              this.tasks.splice(index, 1);
            });
        }
      });
    },
    complete(index) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          let id = this.tasks[index].i;
          firebase
            .firestore()
            .collection(user.uid)
            .doc(id)
            .update({ status: "complete" })
            .then(() => {
              this.tasks[index].status = "complete";
            });
        }
      });
    },
    check(index) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          let id = this.tasks[index].i;
          const date = Number(this.tasks[index].miliseconds);
          const dayInMiliseconds = 86400000;
          const start = Math.floor(
            (date + dayInMiliseconds) / dayInMiliseconds
          );
          const today = moment().format("x");
          const stop = Math.floor(today / dayInMiliseconds);
          if (stop - start > 0) {
            firebase
              .firestore()
              .collection(user.uid)
              .doc(id)
              .update({ status: "overdate" })
              .then(() => {
                this.tasks[index].status = "overdate";
              });
          }
        }
      });
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .firestore()
          .collection(user.uid)
          .onSnapshot(res => {
            const changes = res.docChanges();

            changes.forEach(change => {
              if (change.type === "added") {
                this.tasks.push({
                  ...change.doc.data(),
                  i: change.doc.id
                });
              }
            });
          });
      } else {
        this.tasks = [];
      }
    });
  },
  computed: {
    ...mapGetters({
      user: "user"
    }),
    filteredTasks: function() {
      return this.tasks.filter(task => {
        return task.title.match(this.search);
      });
    }
  }
};
</script>
<style scoped>
.task.complete {
  border-left: 4px solid #3cd1c2;
}
.task.ongoing {
  border-left: 4px solid orange;
}
.task.overdate {
  border-left: 4px solid tomato;
}

.text.complete {
  color: #3cd1c2;
}
.text.ongoing {
  color: orange;
}
.text.overdate {
  color: tomato;
}

.button.complete {
  pointer-events: none !important;
  background-color: #ffffff !important;
}
.icon.complete {
  color: #c0c0c0 !important;
}
.update.button.overdate {
  pointer-events: none !important;
  background-color: #ffffff !important;
}
.update.icon.overdate {
  color: #c0c0c0 !important;
}

.filter {
  display: flex;
  justify-content: center;
  width: 100%;
}
.filtr {
  display: flex;
  justify-content: center;
  width: 40%;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.column.center {
  flex-direction: column;
}

.border {
  border-bottom: 2px solid gray;
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
}

.card_height {
  height: 160px;
}
.list_height {
  max-height: 200px;
}

.break {
  word-wrap: break-word !important;
  white-space: normal;
}
</style>
