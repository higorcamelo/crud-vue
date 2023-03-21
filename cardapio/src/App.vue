<template>
  <div>
    <h1>Cardápio do Restaurante</h1>
    <v-btn @click="dialog = true">Adicionar prato</v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>Novo Prato</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="prato.nome" label="Nome"></v-text-field>
            <v-text-field v-model="prato.preco" label="Preço"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="adicionarPrato">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table :headers="headers" :items="pratos" :search="search" :items-per-page="10">
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editarPrato(item)">mdi-pencil</v-icon>
        <v-icon small @click="excluirPrato(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <v-alert v-model="alerta" :type="tipoAlerta" dismissible>
      {{ mensagemAlerta }}
    </v-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Preço", value: "preco" },
        { text: "Ações", value: "action", sortable: false },
      ],
      pratos: [
        { nome: "Pizza", preco: 25 },
        { nome: "Lasanha", preco: 30 },
      ],
      prato: { nome: "", preco: "" },
      dialog: false,
      alerta: false,
      mensagemAlerta: "",
      tipoAlerta: "",
      search: "",
    };
  },
  methods: {
    adicionarPrato() {
      if (this.prato.nome && this.prato.preco) {
        this.pratos.push(this.prato);
        this.prato = { nome: "", preco: "" };
        this.dialog = false;
        this.mensagemAlerta = "Prato adicionado com sucesso!";
this.tipoAlerta = "success";
this.alerta = true;
} else {
this.mensagemAlerta = "Por favor, preencha o nome e o preço do prato.";
this.tipoAlerta = "error";
this.alerta = true;
}
},
editarPrato(item) {
// preencher o formulário com os dados do prato
this.prato = { nome: item.nome, preco: item.preco };
// abrir o modal popup para editar o prato
this.dialog = true;
},
excluirPrato(item) {
// remover o prato da lista de pratos
const index = this.pratos.indexOf(item);
if (index > -1) {
this.pratos.splice(index, 1);
this.mensagemAlerta = "Prato excluído com sucesso!";
this.tipoAlerta = "success";
this.alerta = true;
} else {
this.mensagemAlerta = "Não foi possível excluir o prato.";
this.tipoAlerta = "error";
this.alerta = true;
}
},
},
};
</script>