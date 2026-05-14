import { API_URL } from './config.js';

const resgisterUser = async (dados) => {
    try{
        const res = await fetch(`${API_URL}/cadastro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
    });

    return res.json();

    }catch(err) {
        console.log('Erro ao conectar a api: ' + err);
    }
};

addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('form-register');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        const res = await resgisterUser(dados);

        localStorage.setItem('authorization', JSON.stringify(res.token));

        window.location.href = 'collections.html'
    });

})