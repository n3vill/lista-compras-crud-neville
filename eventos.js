const API_URL= 'http://localhost:3000'

function marcarTodos() {
    let todos = document.querySelectorAll('[data-check = "acao"]');

    todos.forEach((cadaCheck) => {
        cadaCheck.checked = check_all.checked;
    });

    acionarBotaoExcluir();
}

function buscarParaEditar(id) {
    input_editar_id.value = id;

    fetch(API_URL+'/compras/'+id)     //http://localhost:3000/compras/4
        .then(res => res.json())
        .then(res => {
            input_editar_item.value = res.item;
            input_editar_quantidade.value = res.quantidade;
        });
}

function editar(){
    event.preventDefault();  //impedindo a página de dar refresh

    //recuperando os dados fdo formulário 
    let dados = {
        item: input_editar_item.value,
        quantidade: input_editar_quantidade.value,
    };

    fetch(API_URL+'/compras/'+input_editar_id.value, {
        method: 'PATCH',
        body: JSON.stringify(dados), 
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then((res) => {atualizarLista()});

        let x = document.querySelector ('[data-bs-dismiss="offcanvas"]');   //[data-bs-dismiss="offcanvas"] fechar a janela depois que edita item 

        x.dispatchEvent(new Event('click'));
}


function inserir() {
    //para a página não ser recarregada 
    event.preventDefault();

    let dados = {
        item: input_item.value,
        quantidade: parseInt(input_quantidade.value),
   };

   fetch(API_URL+'/compras/', {
        method: 'POST',
        body: JSON.stringify(dados),
        headers: {
            'Content-Type': 'application/json'   //dizer para a API o que está enviando
        }                       
    })
        .then(resposta => resposta.json())
        .then(resposta => atualizarLista());
    
        form_add.reset();

}


async function excluir (id) {
    let resposta = confirm('Vc tem certeza?');

    if (resposta !== true) {  //historia sopa de pedras
        return;
    }


    await fetch(API_URL+'/compras/'+id, {
        method:"DELETE"
    });

    atualizarLista();
}

function atualizarLista() {

    tabela_compras.innerHTML = '';  //limpar tabela a cada vez que ela é chamada

    fetch('http://localhost:3000/compras')
    .then(function(resposta){
        return resposta.json();
    })
    .then(function (lista){
        lista.forEach(function (cadaItem){
            tabela_compras.innerHTML += `
            <tr>
                <td><input onclick="acionarBotaoExcluir()" value= "${cadaItem.id}" data-check="acao" type ="checkbox"></td>
                <td>${cadaItem.id}</td>
                <td>${cadaItem.item}</td>
                <td>${cadaItem.quantidade}</td>
                <td>
                    <button onclick="buscarParaEditar (${cadaItem.id})" data-bs-toggle= "offcanvas" data-bs-target= "#offcanvasEditar" class= "btn btn-warning">
                        Editar
                    </button>
                
                    <button onclick="excluir(${cadaItem.id})" class="btn btn-danger">
                        Excluir
                    </button>
                </td>
            </tr>
            
            `;
        });

    })
}

atualizarLista()