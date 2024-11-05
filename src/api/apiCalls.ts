import axios from "axios"
const url = 'http://localhost:3001/api'
const token = localStorage.getItem('ctlst-user') !== null ? JSON.parse(localStorage.getItem('ctlst-user') || '').token : ''
const id = localStorage.getItem('ctlst-user') !== null ? JSON.parse(localStorage.getItem('ctlst-user') || '').id : ''

interface LoginProps {
    username: string
    password: string
}

export const postLogin = async (credentials: LoginProps) => {
    try {
        const response = await axios.post(`${url}/login`, credentials)
        if (response) {
            console.log(response.data)
            localStorage.setItem('ctlst-user', JSON.stringify(response.data))
        }

    } catch (error) {
        console.log('Server error.')
    }
}

export const postScreenplay = async (screenplay: { title: string, body: string }) => {
    try {
        const response = await axios.post(`${url}/screenplay`, { ...screenplay, id }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        console.log('Server error.', error)
        throw error
    }
}