<template>

    <div class="container">
       <!-- <div>
            <v-toolbar class ="vtoob_1" elevation="20">
                <v-btn class="button_vt" elevation="0">Lista de Contatos</v-btn>
            </v-toolbar>
        </div> -->

<!-- GET ALL -->
        <div class="div_spa">
            <h2>Lista Telefônica</h2>
        <template>
            <v-data-table
                :headers="headers"
                :items="pessoas"
                :items-per-page="5"
                class="elevation-1"
            ></v-data-table>
        </template>
        </div>

<!-- GET BY ID -->
        <div class="div_spa">
            <h2 class="h2_txt">Buscar Contato</h2>
            <table>
                <tr>
                    <td>
                        <v-toolbar class ="vtoob_1" elevation="20" height="100px" width="270px">
                        <v-text-field
                            class="text_delete"
                            hide-default-footer
                            label="ID"
                            v-model="idPessoaGet.id"
                        ></v-text-field>

                        <v-btn @click.native= "getIdPessoa" class="button_vt" elevation="0">Buscar</v-btn>

                        </v-toolbar>
                    </td>
                    <td>
                         <v-data-table
                            :headers="headers"
                            :items="getIdPP"
                            class="elevation-1"
                            hide-default-footer
                        ></v-data-table>
                    </td>
                </tr>
            </table>
        </div>

<!-- DELETE BY ID-->
        <div class="div_spa">
            <h2 class="h2_txt">Deletar Contato</h2>
            <v-toolbar class ="vtoob_1" elevation="20" height="100px" width="270px">
            <v-text-field
                class="text_delete"
                label="ID"
                hide-details="auto"
                v-model="idPessoa.id"
            ></v-text-field>
            <v-btn @click.native="deletePessoa" class="button_vt" elevation="0">Deletar</v-btn>

            </v-toolbar>
        </div>

<!-- POST -->
        <div class="div_spa">
            <h2 class="h2_txt">Adicionar Contato</h2>
            
            <v-toolbar class ="vtoob_1" elevation="20" height="250px" width="270px">

                <form @submit.prevent= "salvar" method="salvar">
                    
                    <v-text-field
                        class= "text_delete"
                        label= "Nome"
                        :rules= "rules"
                        hide-details= "auto"
                        v-model= "novaPessoa.nome"
                    ></v-text-field>
                                <v-text-field
                        class= "text_delete"
                        label= "Numero do Telefone"
                        :rules= "rules"
                        hide-details= "auto"
                        v-model= "novaPessoa.numeroTelefone"
                    ></v-text-field>
                                <v-text-field
                        class= "text_delete"
                        label= "E-mail"
                        :rules= "rules"
                        hide-details= "auto"
                        v-model= "novaPessoa.email"
                    ></v-text-field>

                    <v-btn class="button_vt2" elevation="0" type= "submit"> Salvar </v-btn>
                </form>
            </v-toolbar>
        </div>

<!-- PUT -->
        <div class="div_spa">
            <h2 class="h2_txt">Alterar Contato</h2>
            
            <v-toolbar class ="vtoob_1" elevation="20" height="320px" width="270px">

                <form @submit.prevent= "putPessoa" method="putPessoa">
                    
                    <v-text-field
                        class= "text_delete"
                        label= "ID"
                        :rules= "rules"
                        hide-details= "auto"
                        v-model= "pessoaAtualizar.id"
                    ></v-text-field>

                    <v-text-field
                        class= "text_delete"
                        label= "Nome"
                        :rules= "rules"
                        hide-details= "auto"
                        v-model= "pessoaAtualizar.nome"
                    ></v-text-field>
                                <v-text-field
                        class= "text_delete"
                        label= "Numero do Telefone"
                        :rules= "rules"
                        hide-details= "auto"
                        v-model= "pessoaAtualizar.numeroTelefone"
                    ></v-text-field>
                                <v-text-field
                        class= "text_delete"
                        label= "E-mail"
                        :rules= "rules"
                        hide-details= "auto"
                        v-model= "pessoaAtualizar.email"
                    ></v-text-field>

                    <v-btn class="button_vt2" elevation="0" type="submit"> ALTERAR </v-btn>
                </form>
            </v-toolbar>
        </div>

    </div>
    
</template>

<script>
import IntegracaoService from '../services/IntegracaoService'

    export default{
        name: 'PessoasContato',
        data(){
            const np = {
                id: '',
                nome: '',
                numeroTelefone: '',
                email: ''
            };

            return{
                novaPessoa: np,

                pessoaAtualizar: {...np},

                getIdPP: [{...np}],

                idPessoa:{
                    id: ''
                },
                idPessoaGet:{
                    id: ''
                },

                pessoas:[],
                headers: [
                    {
                        align: 'start',
                        sortable: false,
                        value: 'name',
                    },
                    { text: 'ID', value: 'id' },
                    { text: 'Nome', value: 'nome' },
                    { text: 'N° Telefone', value: 'numeroTelefone' },
                    { text: 'E-mail', value: 'email' },
                    {value:'icon_add'},
                ]
        
            }

        },
        methods:{
            getAllPessoa(){
                IntegracaoService.getAllPessoa().then((response)=>{
                    this.pessoas = response.data;
                });
            },

            salvar(){
                IntegracaoService.savePessoa(this.novaPessoa).then(() => {
                    this.getAllPessoa();
                    alert("CONTATO CADASTRADO!")
                })
                
            },

            deletePessoa(){
                if(confirm("Excluir contato?")){
                    IntegracaoService.deletePessoa(this.idPessoa.id).then(() => {
                        this.getAllPessoa();
                    }).catch(error=>{
                    if (error.response.status == 404) {
                        alert("Não foi encontrado")
                    }
                })
                }
            },

            putPessoa(){
                IntegracaoService.atualizarPessoa(this.pessoaAtualizar).then(() => {
                    this.getAllPessoa();
                    alert("CONTATO ATUALIZADO!")
                })

            },

            getIdPessoa(){
                IntegracaoService.getByIdPessoa(this.idPessoaGet.id).then((response)=>{
                    this.getIdPP = [response.data];

                }).catch(error=>{
                    if (error.response.status == 404) {
                        alert("Não foi encontrado")
                    }
                })
            }

        },
        created(){
            this.getAllPessoa();
        }        
    }

</script>

<style>
body{
    background-color: antiquewhite;    
}
.vtoob_1{
    margin: 10px;
}

.button_vt{
    margin: 10px;
}
.button_vt2{
    margin: 10px;
}

.text_delete{
    margin: 20px;
}

.h2_txt{
    margin: 5px;
    width: 260px;
}

.div_spa{
    margin: 50px;
}

</style>


