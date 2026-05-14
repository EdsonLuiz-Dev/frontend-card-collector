import { API_URL } from './config.js';

const loginUser = async (dados) => {
    const res = await fetch(`${API_URL}/login`,{
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(dados)
    });

    return res.json();
};


addEventListener("DOMContentLoaded", async () => {
    const formLogin = document.getElementById("form-login");

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const dados = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        const res = await loginUser(dados);

        localStorage.setItem('authorization', JSON.stringify(res.token));
        window.location.href = 'collections.html';
    });
});
