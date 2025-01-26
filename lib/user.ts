export interface Info {
    id: number,
    name: string,
    email: string
}

export interface User {
    token: string | null
    info: Info | null
}

export const EmptyUserState = {
    token: null,
    info: null
}

export const GetUser = (): User => {
    try {
        const userStr = localStorage.getItem('user')
        if(!userStr) {
            return {
                token: null,
                info: null
            }
        } else {
            const user = JSON.parse(userStr)
            if (!user.token || !user.user) {
                localStorage.removeItem('user')
                return {
                    token: null,
                    info: null
                }
            }
            if (!user.user.email || !user.user.id || !user.user.name) {
                localStorage.removeItem('user')
                return {
                    token: null,
                    info: null
                }
            }
            return {
                token: user.token,
                info: {
                    id: user.user.id,
                    name: user.user.name,
                    email: user.user.email
                }
            }
        }
    } catch (e) {
        console.log("get user error: ", e)
        localStorage.removeItem('user')
        return {
            token: null,
            info: null
        }
    }
}

export const IsUserLogin = (user: User): boolean=> {
    return user.token != null && user.info != null
}

export const Logout = () => {
    localStorage.removeItem('user')
}
