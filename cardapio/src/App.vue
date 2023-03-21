<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>Itens do Restaurante</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="openAddItemDialog">Adicionar Item</v-btn>
    </v-toolbar>

    <v-data-table :headers="headers" :items="pratos.data" class="elevation-1" hide-default-footer>
      <template v-slot:[`pratos.actions`]="{ prato }">
        <v-icon @click="deleteItem(prato)">mdi-delete</v-icon>
      </template>
    </v-data-table>

  </div>
</template>
<script>
import axios from 'axios';
export default {
  data () {
    return {
      pratos: [],
      erro: null,
      headers: [
        { text: 'Nome', value: 'nome_prato' },
        { text: 'Preço', value: 'preco' },
        { text: 'Tipo', value: 'tipo'},
        { text: 'Actions', value: 'actions', sortable: false }
      ],
    }
  },
  async mounted() {
    try{
      const response = await axios.get('http://localhost:1337/api/cardapios')
      this.pratos = response.data.data
    } catch(error){
      this.erro = error
    }
  },
  methods: {
    deleteItem (prato) {
      const index = this.pratos.indexOf(prato)
      if (confirm('Are you sure you want to delete this item?')) {
        axios.delete(`http://localhost:1337/api/cardapios/${prato.id}`)
          .then(() => {
            this.pratos.splice(index, 1)
          })
          .catch(error => {
            console.log(error)
          })
      }
  },
    openAddItemDialog () {
    this.addItemDialog = true
  },
  closeAddItemDialog () {
    this.addItemDialog = false
    this.newItemName = ''
    this.newItemPrice = ''
  },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        // Edit item
        axios.put(`http://localhost:1337/api/cardapios/${this.editedItem.id}`, this.editedItem)
          .then(response => {
            Object.assign(this.pratos[this.editedIndex], response.data)
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        // Add new item
        axios.post('http://localhost:1337/api/cardapios', this.editedItem)
          .then(response => {
            this.pratos.push(response.data)
          })
          .catch(error => {
            console.log(error)
          })
      }
      this.close()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
