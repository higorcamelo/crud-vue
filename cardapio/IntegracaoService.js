import axios from "axios";
 const url = 'http://localhost:8080/pessoa'

//const url = axios.create({
//    baseURL: 'http://localhost:8080/pessoa'
//})

class IntegracaoService{
    getAllPessoa(){
        return axios.get(url)

    }

    getByIdPessoa(id){
        return axios.get(url + '/' + id)
    }

    savePessoa(data){
        return axios.post(url, data)

    }

    deletePessoa(id){
        return axios.delete(url + '/' + id)
    }

    atualizarPessoa(data){
        return axios.put(url, data)
    }

}

export default new IntegracaoService()
//getAllPessoa()