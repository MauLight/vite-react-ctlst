import axios from "axios"
import { toast } from "react-toastify"
const url = 'http://localhost:3001/api'
const user = localStorage.getItem('ctlst-user') !== null ? JSON.parse(localStorage.getItem('ctlst-user') || '') : ''

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
        const response = await axios.post(`${url}/screenplay`, { ...screenplay, id: user.id }, {
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
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
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            }
        })
        console.log(response.data.message)
        toast.success(response.data.message)
    } catch (error) {
        console.log('Server error: ', error)
    }

}