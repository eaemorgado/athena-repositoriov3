const input = document.getElementById('input')

input.addEventListener('keypress', () => {
    let inputlenght = input.value.lenght

    if (inputlenght === 3){
        input.value += '.'
    }


})