<template>
  <div>
    <my-header :title="headerTitle" :clickfn="headerFn" :text="notifyText" :error="notifyError"></my-header>
    <div class="content">
      <div class="note">
        <label for="title">Note title
          <img id="prev-title" src="../assets/return.png" @click="returnPrevTitleValue" v-if="isTitleValueChanged(note.title)">
        </label>
        <textarea type="text" id="title" placeholder="Enter title" v-model="note.title"></textarea>
        <label style="margin-top: 5px;">Todos</label>
        <div class="todos" v-for="(todo, index) in note.todoList">
          <textarea type="text" v-model="todo.text"></textarea>
          <label class="checkbox">
            <input type="checkbox" v-model="todo.done" />
            <span></span>
            <img v-if="todo.done" src="../assets/done.png">
          </label>
          <img class="return" src="../assets/return.png" @click="returnPrevTodoValue(index)" v-if="isTodoValueChanged(index)">
          <img src="../assets/remove.png" @click="removeTodo(index)" v-if="note.todoList.length > 1">
        </div>
        <div class="todos new-todo">
          <textarea type="text" placeholder="Enter new todo" v-model="todo.text"></textarea>
          <img src="../assets/add.png" @click="addTodo">
        </div>
        <div class="btn-div">
          <button @click="confirmEdit" >Save changes</button>
          <button @click="confirmCancelEdit" v-if="showCancel">Cancel changes</button>
          <button @click="confirmRevert" v-if="showRevert">Revert changes</button>
        </div>
      </div>
    </div>
    <confirm :text="confirmText" :confirmfn="confirmFn" :closefn="closeConfirmWindow" :show="confirmText !== ''"></confirm>
  </div>
</template>

<script>
    import common from '@/js/common';
    import MyHeader from "./MyHeader";
    import Confirm from "./Confirm";
    export default {
        name: "Note",
        components: {
            MyHeader,
            Confirm
        },
        data() {
          return {
              headerTitle: 'Edit note',
              notifyText: '',
              notifyError: false,
              id: 0,  // id from url query
              note: {id: 0, title: '', todoList: []},
              noteBeforeEdit: {id: 0, title: '', todoList: []},
              editedNote: {id: 0, title: '', todoList: []},
              todo: {text: ''},
              newTodos: [],
              confirmText: '',
              confirmFn: undefined,
              showCancel: false,
              showRevert: false
          }
        },
        created() {
            this.id = parseInt(this.$route.query.id);
            let notes = common.getNotes();
            for (let i = 0; i < notes.length; i++) {
                if (this.id === notes[i].id) {
                    this.note = notes[i];
                    this.noteBeforeEdit.id = this.note.id;
                    this.noteBeforeEdit.title = this.note.title;
                    for (let todo of this.note.todoList) {
                        this.noteBeforeEdit.todoList.push({text:todo.text, done:todo.done});
                    }
                    return;
                }
            }
            this.$router.replace('/');
        },
        methods: {
            headerFn () {
                this.$router.replace('/');
            },
            editNote () {
                this.confirmText = '';
                if(this.note.id > 0) {
                    if (this.todo.text.replace(/\s+/g, '') !== '') {
                        this.note.todoList.push({text:this.todo.text, done: false});
                        this.todo.text = '';
                    }
                    let notes = common.getNotes();
                    for (let note of notes) {
                        if (note.id === this.note.id) {
                            note.title = this.note.title;
                            note.todoList = [];
                            for (let todo of this.note.todoList) {
                                note.todoList.push({text:todo.text,done:todo.done})
                            }
                            localStorage.setItem('notes', JSON.stringify(notes));
                            this.notifyText = 'Edited successfully';
                            setTimeout( () => {
                                this.notifyText = '';
                            }, 2000);
                            this.newTodos = [];
                            this.showCancel = true;
                            this.showRevert = false;
                            if (this.editedNote.id > 0) {
                                this.noteBeforeEdit.title = this.editedNote.title;
                                this.noteBeforeEdit.todoList = [];
                                for (let todo of this.editedNote.todoList) {
                                    this.noteBeforeEdit.todoList.push({text: todo.text, done: todo.done});
                                }
                            }
                            this.editedNote = {
                                id: note.id,
                                title: note.title,
                                todoList: []
                            };
                            for (let todo of note.todoList) {
                                this.editedNote.todoList.push({text: todo.text, done: todo.done});
                            }
                            return;
                        }
                    }
                }
            },
            cancelChanges () {
                this.confirmText = '';
                let notes = common.getNotes();
                for (let note of notes) {
                    if (note.id === this.noteBeforeEdit.id) {
                        note.title = this.noteBeforeEdit.title;
                        note.todoList = [];
                        for (let todo of this.noteBeforeEdit.todoList) {
                            note.todoList.push({text:todo.text,done:todo.done})
                        }
                        localStorage.setItem('notes', JSON.stringify(notes));
                        this.note = note;
                        this.showRevert = true;
                        this.showCancel = false;
                        return;
                    }
                }
            },
            revertChanges () {
                this.confirmText = '';
                if (this.editedNote.id > 0) {
                    let notes = common.getNotes();
                    for (let note of notes) {
                        if (note.id === this.editedNote.id) {
                            note.title = this.editedNote.title;
                            note.todoList = [];
                            for (let todo of this.editedNote.todoList) {
                                note.todoList.push({text:todo.text,done:todo.done})
                            }
                            localStorage.setItem('notes', JSON.stringify(notes));
                            this.note = note;
                            this.showRevert = false;
                            this.showCancel = true;
                            return;
                        }
                    }
                }
            },
            returnPrevTitleValue () {
                if (this.editedNote.id > 0 && !this.showRevert) {
                    this.note.title = this.editedNote.title;
                } else {
                    this.note.title = this.noteBeforeEdit.title;
                }
            },
            returnPrevTodoValue (index) {
                if (this.editedNote.id > 0 && !this.showRevert) {
                    if (index >= this.editedNote.todoList.length) {
                        this.note.todoList[index].text = this.newTodos[index - this.editedNote.todoList.length].text;
                    } else {
                        this.note.todoList[index].text = this.editedNote.todoList[index].text;
                    }
                } else {
                    if (index >= this.noteBeforeEdit.todoList.length) {
                        this.note.todoList[index].text = this.newTodos[index - this.noteBeforeEdit.todoList.length].text;
                    } else {
                        this.note.todoList[index].text = this.noteBeforeEdit.todoList[index].text;
                    }
                }
            },
            addTodo () {
                if (this.todo.text.replace(/\s+/g, '') === '') {
                    this.todo.text = '';
                    return;
                }
                this.note.todoList.push({text: this.todo.text, done: false});
                this.newTodos.push({text: this.todo.text, done: false});
                this.todo = {text: '', done: false};
            },
            removeTodo (index) {
                this.note.todoList.splice(index, 1);
                if (this.editedNote.id > 0 && !this.showRevert) {
                    if (index >= this.editedNote.todoList.length) {
                        this.newTodos.splice(index - this.editedNote.todoList.length, 1);
                    }
                } else {
                    if (index >= this.noteBeforeEdit.todoList.length) {
                        this.newTodos.splice(index - this.noteBeforeEdit.todoList.length, 1);
                    }
                }
            },
            confirmEdit () {
                this.confirmText = 'Save edited note?';
                this.confirmFn = this.editNote;
            },
            confirmCancelEdit () {
                this.confirmText = 'Cancel edit?';
                this.confirmFn = this.cancelChanges;
            },
            confirmRevert () {
                this.confirmText = 'Return edited note?';
                this.confirmFn = this.revertChanges;
            },
            isTitleValueChanged (title) {   // if true, revert button will appear
                try {
                    if (this.editedNote.id > 0 && !this.showRevert) {
                        return title !== this.editedNote.title;
                    } else {
                        return title !== this.noteBeforeEdit.title;
                    }
                }  catch (e) {
                    console.error('titleValueChanged() error:', e);
                    return false;
                }
            },
            isTodoValueChanged (index) {    // if true, revert button will appear
                try {
                    let lenBefore = 0;
                    if (this.editedNote.id > 0 && !this.showRevert) {
                        console.log('if')
                        lenBefore = this.editedNote.todoList.length;
                        return lenBefore > index ?
                            this.note.todoList[index].text !== this.editedNote.todoList[index].text :
                            this.note.todoList[index].text !== this.newTodos[index - lenBefore].text;
                    } else {
                        console.log('else')
                        lenBefore = this.noteBeforeEdit.todoList.length;
                        return lenBefore > index ?
                            this.note.todoList[index].text !== this.noteBeforeEdit.todoList[index].text :
                            this.note.todoList[index].text !== this.newTodos[index - lenBefore].text;
                    }
                } catch (e) {
                    console.error('todoValueChanged() error:', e);
                    return false;
                }
            },
            closeConfirmWindow () {
                this.confirmText = '';
            }
        }
    }
</script>

<style scoped>
textarea {
  border-radius: 5px;
  min-height: 30px;
  max-height: 30px;
  width: 70%;
  resize: vertical;
}
label {
  width: 100%;
  text-align: left;
  font-size: 20px;
  position: relative;
}
img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
}
.note {
  margin: 10px 0 80px;
  padding: 20px 20% 20px 20%;
  display: flex;
  flex-direction: column;
  background-color: rgba(0,0,0,0.2);
  border-top: 2px solid rgba(0,0,0,0.1);
  position: relative;
}
#title {
  margin: 5px 0 10px 0;
  width: 85%;
}
#prev-title {
  position: absolute;
  right: 0;
  bottom: -35px;
}
.todos {
  display: flex;
  margin-bottom: 20px;
  position: relative;
  padding: 10px 10px 10px 0;
}
.todos img {
  position: absolute;
  top: calc(50% - 12.5px);
  right: -70px;
}
.todos .return {
  right: -35px;
}
.checkbox {
  cursor: pointer;
  width: 25px;
  height: 25px;
  position: absolute;
  top: calc(50% - 12.5px);
  right: 0;
  font-size: 14px;
}
.checkbox input {
  padding: 0;
  visibility: hidden;
}
.checkbox img {
  width: 25px;
  height: 25px;
  position: absolute;
  top: 0;
  left: 0;
}
.checkbox input+span {
  display: inline-block;
  width: 25px;
  height: 25px;
  background-color: grey;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255,255,255,1);
}
@media (min-width: 600px) {
  .todos textarea {
    width: 90%;
  }
}
@media (max-width: 599px) {
  .note {
    padding: 20px 5% 20px 5%;
  }
  .checkbox {
    right: 20%;
  }
  .todos img {
    right: 0;
  }
  .todos .return {
    right: 10%;
  }
  .new-todo img {
    right: 20%;
  }
}
</style>
