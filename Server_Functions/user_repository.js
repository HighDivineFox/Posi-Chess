import axios from 'axios';
const BASE_URL = 'http://192.168.0.2:5000';

export function getUser(data) {
    return axios.get(`${BASE_URL}/api/v1/user/email/${data.email}/password/${data.password}`)
            .then(response => response.data)
}

export function getUserByID(ID) {
    return axios.get(`${BASE_URL}/api/v1/user/id/${ID}`)
            .then(response => response.data)
}

export function createUser(data) {
    return axios.post(`${BASE_URL}/api/v1/user/create`, data)
        .then(response => response.data)
}

export function insertNewUserPosition(data) {
    return axios.post(`${BASE_URL}/api/v1/user/savePos`, data)
        .then(response => response.data)
}

export function updateExistingPosition(data) {
    return axios.post(`${BASE_URL}/api/v1/user/updatePos`, data)
        .then(response => response.data)
}

export function getUserLookingForGame() {
    return axios.get(`${BASE_URL}/api/v1/user/looking`)
        .then(response => response.data)
}

export function deleteUserPosition(data) {
    return axios.post(`${BASE_URL}/api/v1/user/deletePos`, data)
        .then(response => response.data)
}

export function getWhitePos(ID) {
    return axios.get(`${BASE_URL}/api/v1/user/id/${ID}/whitepos`)
        .then(response => response.data)
}

export function userExists(email) {
    return axios.get(`${BASE_URL}/api/v1/user/email/${email}`)
        .then(response => response.data)
}

export function doesUserExist(username, email) {
    return axios.get(`${BASE_URL}/api/v1/user/username/${username}/email/${email}`)
        .then(response => response.data)
}