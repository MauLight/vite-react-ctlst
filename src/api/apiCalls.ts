import axios from "axios"
const url = 'http://localhost:3001/api'

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