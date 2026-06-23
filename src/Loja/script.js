let produtos

window.onload = function () {
    var storedUser = localStorage.getItem("usuario")
    if (!storedUser) return; // Evita erros se não houver usuário logado
    
    var user = JSON.parse(storedUser)
    var dataEntrada = new Date(user.dataEntrada)

    var dataFormatada = dataEntrada.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric"
    })

    document.getElementById('user').textContent = user.name
    document.getElementById('perfil').textContent = dataFormatada
    document.getElementById('idPerfil').textContent = user.id
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("../Dados/data.json")
        .then((response) => response.json())
        .then((data) => {
            produtos = data

            const produtosContainer = document.getElementById("produtos-container")

            produtos.forEach((produto, index) => {
                const card = document.createElement("div")
                card.innerHTML = `
                    <div class="card" style="width: 18rem; margin: 10px;">
                        <img src="${produto.imagem}" class="card-img-top" alt="${produto.desc}">
                        <div class="card-body">
                            <h5 class="card-title">${produto.desc}</h5>
                            <p class="card-text">Salário: R$ ${produto.sal.toFixed(2)}</p>
                            <a href="#" class="btn btn-primary adicionar" data-indice="${index}">
                                Encaminhar
                            </a>
                        </div>
                    </div>
                `
                produtosContainer.appendChild(card)
            })
        }).catch((error) => console.log("Erro ao carregar dados", error))
})

document.getElementById("produtos-container").addEventListener("click", function(event){
    const btn = event.target.closest(".adicionar")
    if(!btn) return

    event.preventDefault() // Evita que a página role para o topo ao clicar no "#"

    const indexDoProduto = btn.dataset.indice
    const produtoSelecionado = produtos[indexDoProduto]
    
    if (produtoSelecionado) {
        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []
        
        // CORREÇÃO 2: Convertendo "sal" do JSON para "preco" para o carrinho entender
        carrinho.push({
            id: produtoSelecionado.id,
            desc: produtoSelecionado.desc,
            imagem: produtoSelecionado.imagem,
            preco: produtoSelecionado.sal // Transforma 'sal' em 'preco'
        })
        
        localStorage.setItem("carrinho", JSON.stringify(carrinho))
        alert(`${produtoSelecionado.desc} adicionado ao carrinho com sucesso!`)
    }
})