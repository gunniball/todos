<template>
  <div>
    <my-header :title="headerTitle" :clickfn="toNewNote" :text="notifyText" :error="notifyError"></my-header>
    <div class="content" v-if="!newNote">
      <ul v-if="notes.length">
        <li v-for="(note, index) in notes" class="div-flex-col">
          <div class="div-flex-row" style="position: relative;">
            <p style="font-size: 20px; text-align: left; padding-left: 12px;">{{note.title}}</p>
            <p style="width: 30%;"></p>
            <img class="edit" src="../assets/edit.png" @click="editNote(note.id)">
            <img class="remove" src="../assets/remove.png" @click="confirmDelete(index)">
          </div>
          <div>
            <ul>
              <li>You have {{note.todoList.length}} todos</li>
              <li v-for="todo in note.todoList.slice(0,2)" class="todo">
                <div class="div-flex-row notes">
                  <p>{{todo.text}}</p>
                  <img src="../assets/completed.png" v-if="todo.done">
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <h2 v-else>You don't have any note</h2>
    </div>
    <new-note v-else :validatefn="validateNewNote"></new-note>
    <confirm :text="confirmText" :show="confirmText !== ''" :confirmfn="deleteNote" :closefn="closeConfirmWindow"></confirm>
  </div>
</template>

<script>
import NewNote from "./NewNote";
import MyHeader from "./MyHeader";
import Confirm from "./Confirm";
import common from "../js/common";
export default {
    name: 'Main',
    components: {
        NewNote,
        MyHeader,
        Confirm
    },
    data () {
        return {
            headerTitle: 'My notes',
            notes: [],
            newNote: false,
            notifyText: '',
            notifyError: false,
            confirmText: '',
            deleteIndex: -1
        }
    },
    created() {
        this.notes = common.getNotes();
    },
    methods: {
        toNewNote () {
            this.newNote = !this.newNote;
        },
        editNote (id) {
            this.$router.replace(`/edit?id=${id}`);
        },
        validateNewNote (note, todo, saveFunc) {
            if (note.title.replace(/\s+/g, '') === '') {
                note.title = '';
                this.notifyError = true;
                this.notifyText = 'Enter title!!!';
                setTimeout(function () {
                    this.notifyError = false;
                    this.notifyText = '';
                }.bind(this), 2000);
                return;
            }
            if (todo.text.replace(/\s+/g, '') !== '') {
                note.todoList.push(todo);
            } else {
                todo.text = '';
            }
            if (note.todoList.length === 0){
                this.notifyError = true;
                this.notifyText = 'Add at least one todo!!!';
                setTimeout(function () {
                    this.notifyError = false;
                    this.notifyText = '';
                }.bind(this), 2000);
                return;
            }
            saveFunc();
            this.notifyText = 'Saved successfully';
            setTimeout( ()=>{
                this.notifyText = '';
                this.newNote = false;
            }, 2000);
        },
        deleteNote () {
            if (this.deleteIndex >= 0 && this.deleteIndex < this.notes.length) {
                this.notes.splice(this.deleteIndex, 1);
                localStorage.setItem('notes', JSON.stringify(this.notes));
                this.closeConfirmWindow();
                this.notifyText = 'Deleted successfully';
                setTimeout( ()=>{
                    this.notifyText = '';
                    this.newNote = false;
                }, 2000);
            }
        },
        confirmDelete (index) {
            console.log(index);
            this.deleteIndex = index;
            this.confirmText = 'Delete note?';
        },
        closeConfirmWindow () {
            this.confirmText = '';
            this.deleteIndex = -1;
        }
    },
    watch: {
        newNote(val) {
            if (val) {
                this.headerTitle = 'New note';
            } else {
                this.headerTitle = 'My notes';
                this.notes = common.getNotes();
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul, li {
    margin: 0;
    padding: 10px;
    list-style: none;
  }
  li {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  p {
    text-align: left;
    margin: 0;
  }
  .todo {
    color: white;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .notes {
    position: relative;
  }
  .notes p {
    overflow: hidden;
    width: 80%;
  }
  .notes img {
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    top: calc(50% - 0.75rem);
    right: 0.2rem;
  }
  .div-flex-col {
    display: flex;
    flex-direction: column;
  }
  .div-flex-row {
    display: flex;
  }
  .div-flex-row p {
    max-width: 80%;
    overflow: hidden;
  }
  .edit, .remove {
    width: 1.6rem;
    height: 1.6rem;
    cursor: pointer;
    position: absolute;
    top: calc(50% - 0.8rem);
  }
  .edit {
    right: 3.4rem;
  }
  .remove {
    right: 1rem;
  }
</style>
