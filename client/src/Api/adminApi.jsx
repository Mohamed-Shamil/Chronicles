import axiosConfig from "../Config/axiosAuth";

const adminApi = () => {

    const adminLogin = async (loginData) => {
        const resposne = await axiosConfig.post('admin/adminLogin',loginData)
        return resposne
    }

    return {
        adminLogin
    }
}

export default adminApi