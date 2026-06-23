$(document).ready(function() {
    // Carrega o carrinho e remove automaticamente qualquer item inválido/nulo antigo
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho = carrinho.filter(item => item !== null && item !== undefined && item.desc);

    const listElement = $("#lista");
    const totalElement = $("#total");

    function exibirCarrinho(){
        listElement.empty();
        let totalPreco = 0;

        // Se o carrinho estiver vazio, avisa o utilizador
        if (carrinho.length === 0) {
            listElement.append("<li>O seu carrinho está vazio.</li>");
            totalElement.text("Total: R$ 0,00");
            return;
        }

        $.each(carrinho, function(index, item){
            const listItem = $("<li>").text(`${item.desc} - Preço: R$ ${item.preco.toFixed(2)}`);

            const removeButton = $("<button>").text("❌").css("margin-left", "10px").click(function(){
                removerItem(index);
            });

            listItem.append(removeButton);
            listElement.append(listItem);

            totalPreco += item.preco;
        });
        
        totalElement.text(`Total: R$ ${totalPreco.toFixed(2)}`);
    }

    function removerItem(index){
        carrinho.splice(index, 1);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        exibirCarrinho();
    }
    
    exibirCarrinho();
});

function gerar(){
    const listaElement = document.getElementById("lista"); 
    const totalElement = document.getElementById("total"); 
    
    if (!listaElement || !totalElement) return;

    // Clona a lista para remover os botões de ❌ antes de exportar para o Word
    const listaClone = listaElement.cloneNode(true);
    $(listaClone).find("button").remove();
    
    const listaHtml = listaClone.innerHTML;
    const totalHtml = totalElement.innerHTML;
    
    // Validação para não gerar ficheiros vazios
    if (!listaHtml.trim() || listaHtml.includes("carrinho está vazio")) {
        alert("Adicione produtos ao carrinho antes de gerar o pedido!");
        return;
    }

    // Estrutura HTML completa com estilos básicos para o Word aceitar a formatação
    const conteudoHTML = `
        <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 20px; }
                    h1 { color: #2c3e50; font-size: 24px; border-bottom: 2px solid #34495e; padding-bottom: 10px; }
                    h3 { color: #7f8c8d; font-size: 16px; }
                    ul { margin-top: 20px; }
                    li { font-size: 14px; margin-bottom: 8px; list-style-type: square; }
                    .total { font-size: 18px; font-weight: bold; color: #27ae60; margin-top: 30px; }
                </style>
            </head>
            <body>
                <h1>PEDIDO CONFIRMADO</h1>
                <h3>Agradecemos a sua compra e preferência.</h3>
                <br>
                <ul>
                    ${listaHtml}
                </ul>
                <br>
                <div class="total">${totalHtml}</div>
            </body>
        </html>  
    `;

    const blob = new Blob([conteudoHTML], {type: "application/msword"});
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "pedido.doc";
    link.click();
    
    const divPedido = document.getElementById("pedido");
    if (divPedido) {
        divPedido.style.display = "block";
    }
}

function successClose(){
    const divPedido = document.getElementById("pedido");
    if (divPedido) {
        divPedido.style.display = "none";
    }
}