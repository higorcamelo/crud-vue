<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>Itens do Restaurante</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="openAddItemDialog">Adicionar Item</v-btn>
    </v-toolbar>

    <v-data-table :headers="headers" :items="items" :search="search" hide-default-footer>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="addItemDialog" max-width="500px">
      <v-card>
        <v-card-title>Adicionar Item</v-card-title>
        <v-card-text>
          <v-text-field v-model="newItemName" label="Nome"></v-text-field>
          <v-text-field v-model="newItemPrice" label="Preço"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addItem">Adicionar</v-btn>
          <v-btn @click="addItemDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      items: [],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        name: '',
        price: null
      },
      defaultItem: {
        name: '',
        price: null
      },
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Price', value: 'price' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize () {
      axios.get('http://localhost:1337/items')
        .then(response => {
          this.items = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    editItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      const index = this.items.indexOf(item)
      if (confirm('Are you sure you want to delete this item?')) {
        axios.delete(`http://localhost:1337/items/${item.id}`)
          .then(() => {
            this.items.splice(index, 1)
          })
          .catch(error => {
            console.log(error)
          })
      }
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
        axios.put(`http://localhost:1337/items/${this.editedItem.id}`, this.editedItem)
          .then(response => {
            Object.assign(this.items[this.editedIndex], response.data)
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        // Add new item
        axios.post('http://localhost:1337/items', this.editedItem)
          .then(response => {
            this.items.push(response.data)
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