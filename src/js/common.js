
const common = {
    getNotes () {
      let jsonString = localStorage.getItem('notes'), notes = [];
      if (jsonString && jsonString !== '' && jsonString !== '{}') {
        notes = JSON.parse(jsonString);
      }
      return notes;
    }
};

export default common;
