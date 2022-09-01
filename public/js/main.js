const valorEvento = document.querySelectorAll('.valorEvento')
const valorIngresso = document.querySelector('.valor-ingresso')

for(let i = 0; i < valorEvento.length; i++){
    if(valorEvento[i].textContent == 'R$ 0.00'){
        valorEvento[i] = valorEvento[i].textContent = 'GRATUITO'
    }
}

function modificaIngresso(){
    if(valorIngresso.textContent == 'R$ 0.00'){
        valorIngresso.textContent = 'GRATUITO'
    }
}
modificaIngresso()

