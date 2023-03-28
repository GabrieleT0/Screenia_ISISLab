import { user as userModel } from "../../models";

const getUserToApprove = async (idUser) => {
    if(idUser) throw new Error("User is required!");

    try {
        const users = await userModel.findAll({
            where: { is_approved: false, account_verify: true },
            order: [['registered_date', 'DESC']],
        });

        return users;
    } catch(e) {
        throw new Error(e);
    }   
}

const approvalUsers = async (idUsers = []) => {
    try {
        const updateUser = await userModel.update(
            {
              is_approved: true,
              role_id: 2
            },
            {
              where: { 
                    id: [...idUsers]
                }
            }
        );

        return updateUser;
    } catch(e) {
        throw new Error(e);
    }
}

const getUserByPk = async (id) => {
    try {
        const user = await userModel.findByPk(id);

        return user;
    } catch(e) {
        throw new Error(e);
    }
}

const UserService = {
    getUserToApprove,
    approvalUsers,
    getUserByPk
}

export default UserService;