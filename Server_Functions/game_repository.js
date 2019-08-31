import axios from 'axios';
const BASE_URL = 'http://192.168.0.2:5000';

export function getGame(ID) {
    return axios.get(`${BASE_URL}/api/v1/game/id/${ID}`)
        .then(response => response.data)
}

export function getGameWithPlayerID(ID) {
    return axios.get(`${BASE_URL}/api/v1/game/playerId/${ID}`)
        .then(response => response.data)
}

export function getOpenGames() {
    return axios.get(`${BASE_URL}/api/v1/game/open`)
        .then(response => response.data)
}

export function postGame(data) {
    return axios.post(`${BASE_URL}/api/v1/game/create`, data)
        .then(response => response.data)
}