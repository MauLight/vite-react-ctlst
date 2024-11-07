import axios from "axios"
import { toast } from "react-toastify"
const url = 'http://localhost:3001/api'
const user = localStorage.getItem('ctlst-user') !== null ? JSON.parse(localStorage.getItem('ctlst-user') || '') : ''

interface LoginProps {
    username: string
    password: string
}

const headers = {
    'Authorization': `Bearer ${user.token}`,
    'Content-Type': 'application/json'
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
        const response = await axios.post(`${url}/screenplay`, { ...screenplay, id: user.id }, {
            headers
        })
        return response.data
    } catch (error) {
        console.log('Server error.', error)
        throw error
    }
}

export const sendInvitationToScreenplayAsync = async (recipientId: string, documentId: string) => {
    try {
        const response = await axios.post(`${url}/events/send`, { senderId: user.id, senderUsername: user.username, recipientId, documentId }, {
            headers
        })
        toast.success(response.data.message)
    } catch (error) {
        console.log('Server error: ', error)
    }

}

export const getScrenplaysByUserId = async () => {
    try {
        const response = await axios.get(`${url}/user/screenplays/${user.id}`, {
            headers
        })
        return response.data
    } catch (error) {
        console.error('Server error: ', error)
    }
}

export const updateScreenplayById = async (id: string, content: string) => {
    try {
        const response = await axios.put(`${url}/screenplay`, { id, content }, {
            headers
        })

        return response.data
    } catch (error) {
        console.error('Server error: ', error)
    }
}