<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>Itens do Restaurante</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <table class="center">
      <tr>
        <td>
          <v-form @submit.prevent method="criaPrato">
            <td>
              <v-text-field label="Nome do prato" required class="novoPrato.nome"></v-text-field>
            </td>
            <td>
              <v-text-field label="Preço do prato" required class="novoPrato.preco"></v-text-field>
            </td>
            <td>
              <v-select label="Tipo do prato"  required class="novoPrato.tipo" menu-props="auto" :items="['Entrada', 'Carne', 'Massa', 'Bebida', 'Sobremesa']"></v-select>
            </td>
            <td><v-btn color="blue" text type='submit'>Salvar</v-btn></td>
          </v-form>
        </td>
      </tr>
    </table>
      
       

    <v-data-table dense :headers="headers" :items="pratos" class="center" hide-default-footer>
      <template v-slot:[`item.controls`]="props">
        <v-btn icon color="red" @click="deletaPrato(props.item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn icon color="blue" @click="atualizaPrato(props.item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="editar" max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Prato</span>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="atualizaPrato">
            <v-text-field label="Nome do prato" v-model="novoPrato.nome" required></v-text-field>
            <v-text-field label="Preço do prato" v-model="novoPrato.preco" required></v-text-field>
            <v-select label="Tipo do prato" v-model="novoPrato.tipo" :items="tipos" required></v-select>
            <v-btn type="submit" color="primary">Atualizar</v-btn>
            <v-btn color="primary" @click="cancelar">Cancelar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data () {
    const nPrato = {
      id: '',
      nome: '',
      preco: 0,
      tipo: ''
    }
    return {
      novoPrato:nPrato,
      pratos: [],
      erro: null,
      dialog:false,
      headers: [
        { text: 'Nome', value: 'Nome' },
        { text: 'Preço', value: 'Preco' },
        { text: 'Tipo', value: 'Tipo'},
        { text: 'Ações', sortable: false },
        { text: "", value: "controls", sortable: false }
      ],
    }
  },
  async mounted() {
    try{
      const response = await axios.get('http://localhost:1337/api/cardapios')
      this.pratos = response.data.data
      this.pratos = this.pratos.map(p =>{
        return{
          id: p.id,
          ...p.attributes
        }
      });
    } catch(error){
      this.erro = error
    }
  },
  methods: {
    async criaPrato(){
    try {
      await axios.post('http://localhost:1337/api/cardapios', this.novoPrato);
      const response = await axios.get('http://localhost:1337/api/cardapios');
      this.pratos = response.data.data.map(p => {
        return {
          id: p.id,
          ...p.attributes
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
    deletaPrato (prato) {
      const index = this.pratos.indexOf(prato)
      if (confirm('Deseja apagar mesmo esse prato?')) {
        axios.delete(`http://localhost:1337/api/cardapios/${prato.id}`)
          .then(() => {
            this.pratos.splice(index, 1)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    async atualizaPrato(prato) {
  try {
    await axios.put(`http://localhost:1337/api/cardapios/${prato.id}`, {
      nome: prato.nome,
      preco: prato.preco,
      tipo: prato.tipo
    });
    // Atualiza a lista de pratos após a atualização bem sucedida
    const response = await axios.get('http://localhost:1337/api/cardapios');
    this.pratos = response.data.data.map(p => ({
      id: p.id,
      ...p.attributes
    }));
  } catch (error) {
    console.log(error);
  }
},
    
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
.center {
  margin-left: auto;
  margin-right: auto;
}

</style>
