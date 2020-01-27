<template>
  <div class="content">
    <div class="note">
      <label for="title">Note title</label>
      <textarea type="text" placeholder="Enter title" id="title" v-model="note.title"></textarea>
      <label style="margin-top: 5px;">Todos</label>
      <div class="todos" v-if="note.todoList.length > 0" v-for="(todo, index) in note.todoList">
        <p>{{todo.text}}</p>
        <img src="../assets/remove.png" @click="removeTodo(index)">
      </div>
      <div class="todos">
        <textarea type="text" placeholder="Enter new todo" v-model="todo.text"></textarea>
        <img src="../assets/add.png" @click="addTodo">
      </div>
      <div class="btn-div">
        <button @click="validate">Save new note</button>
      </div>
    </div>
  </div>
</template>

<script>
    import common from '../js/common'
    export default {
        name: "NewNote",
        props: ["validatefn"],
        data() {
          return {
              note: {id: -1, title: '', todoList: []},
              todo: {text: '', done: false},
          }
        },
        methods: {
            addTodo () {
                if (this.todo.text.replace(/\s+/g, '') === '') {
                    this.todo.text = '';
                    return;
                }
                this.note.todoList.push(this.todo);
                this.todo = {text: '', done: false};
            },
            removeTodo (index) {
                this.note.todoList.splice(index, 1);
            },
            validate() {
                // validates input values, then saves new note
                this.validatefn(this.note, this.todo, this.saveNewNote);
            },
            saveNewNote () {
                let notes = common.getNotes();
                if (notes.length > 0) {
                    this.note.id = notes[0].id + 1;
                } else {
                    this.note.id = 1;
                }
                notes.unshift(this.note);
                localStorage.setItem('notes', JSON.stringify(notes));
            }
        }
    }
</script>

<style scoped>
  textarea {
    border-radius: 5px;
    min-height: 30px;
    max-height: 30px;
    width: 88%;
    resize: vertical;
  }
  label {
    width: 100%;
    text-align: left;
    font-size: 20px;
  }
  p {
    width: 90%;
    height: auto;
    text-align: left;
    vertical-align: middle;
    padding: 0.1rem;
    margin: 0;
    border-top: 2px solid rgba(0,0,0,0.2);
    border-bottom: 2px solid rgba(0,0,0,0.2);
    border-radius: 5px;
    overflow: hidden;
  }
  .note {
    margin-top: 10px;
    padding: 20px 20% 20px 20%;
    display: flex;
    flex-direction: column;
    background-color: rgba(0,0,0,0.2);
    border-top: 2px solid rgba(0,0,0,0.1);
    position: relative;
  }
  #title {
    margin: 5px 0 10px 0;
  }
  .todos {
    display: flex;
    margin-bottom: 20px;
    position: relative;
    padding: 10px 10px 10px 0;
  }
  .todos img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    top: calc(50% - 12.5px);
    right: -5px;
  }
</style>
