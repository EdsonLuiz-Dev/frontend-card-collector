import { API_URL } from '../config.js';

const getCollections = async () => {
    try{

        const token = localStorage.getItem('authorization');

        const res = await fetch(`${API_URL}/collection`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if(res.status === 401) {
            return window.location.href = "login.html"
        }

        return res.json();
    }catch(err){
        console.log('Erro ao conectar a api ' + err);
    };
};

addEventListener('DOMContentLoaded', async () => {
    const res = await getCollections();

    return res.json;
})