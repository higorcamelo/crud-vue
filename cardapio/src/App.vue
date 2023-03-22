<template>
  <div class = 'app'>
    <v-app>
      <h2>Itens do Restaurante</h2>
      <div class="form-wrapper">
        <table class="center">
          <tr>
            <td>
              <v-form @submit.prevent="criaPrato" method="criaPrato">
                <td>
                  <v-text-field class="form-field" label="Nome do prato" required v-model="novoPrato.nome"></v-text-field>
                </td>
                <td>
                  <v-text-field class="form-field" label="Preço do prato" required v-model="novoPrato.preco"></v-text-field>
                </td>
                <td>
                  <v-select class="form-field" label="Tipo do prato"  required v-model="novoPrato.tipo" menu-props="auto" :items="['Entrada', 'Carne', 'Massa', 'Bebida', 'Sobremesa']"></v-select>
                </td>
                <td><v-btn class="form-btn" color="blue" text type='submit'>Salvar</v-btn></td>
              </v-form>
            </td>
          </tr>
        </table>
      </div>

      <div class="center">
        <v-data-table dense :headers="headers" :items="pratos" class="center" hide-default-footer>
          <template v-slot:[`item.controls`]="props">
            <v-btn icon color="red" @click="deletaPrato(props.item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>

      <div class="form-wrapper">
        <table class="center">
          <tr>
            <td>
              <v-form @submit.prevent="editaPrato(attPrato)" >
                <td>
                  <v-text-field class="form-field" label="ID do prato" required v-model="attPrato.id"></v-text-field>
                </td>
                <td>
                  <v-text-field class="form-field" label="Novo nome do prato" v-model="attPrato.nome"></v-text-field>
                </td>
                <td>
                  <v-text-field class="form-field" label="Novo do prato" v-model="attPrato.preco"></v-text-field>
                </td>
                <td>
                  <v-select class="form-field" label="Novo tipo do prato"  v-model="attPrato.tipo" menu-props="auto" :items="['Entrada', 'Carne', 'Massa', 'Bebida', 'Sobremesa']"></v-select>
                </td>
                <td><v-btn class="form-btn" color="blue" text type='submit'>Atualizar</v-btn></td>
              </v-form>
            </td>
          </tr>
        </table>
      </div>
    </v-app>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data () {
    const nPrato = {
      'data': {
        'nome': '',
        'preco': 0,
        'tipo': ''
      }
    }
    const ePrato = {
      'data': {
        'id':'',
        'nome': '',
        'preco': 0,
        'tipo': ''
      }
    }
    return {
      novoPrato: nPrato,
      attPrato: {...ePrato},
    

      pratos: [],
      erro: null,
      dialog:false,
      headers: [
        { text: 'id', value:'id'},
        { text: 'Nome', value: 'nome' },
        { text: 'Preço', value: 'preco' },
        { text: 'Tipo', value: 'tipo'},
        { text: "Ações", value: "controls", sortable: false }
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
      axios.post('http://localhost:1337/api/cardapios', {
        data :{
          nome: this.novoPrato.nome,
          preco: this.novoPrato.preco,
          tipo: this.novoPrato.tipo
        }
      }).then(()=>{
        this.mounted()
      })
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
    async editaPrato(prato) {
      try {
        await axios.put(`http://localhost:1337/api/cardapios/${prato.id}`, {
          data :{
            id: this.attPrato.id,
            nome: this.attPrato.nome,
            preco: this.attPrato.preco,
            tipo: this.attPrato.tipo
        }
        });
        const response = await axios.get('http://localhost:1337/api/cardapios');
        this.pratos = response.data
      } catch (error) {
        console.log(error);
      }
},
    
  }
}
</script>

<style>
.app {
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
