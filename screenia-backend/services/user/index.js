const { Op } = require("sequelize");
import { user as userModel } from "../../models";
import RoleService from "../role";

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

const getUserEditor = async () => {
    try {
        const roleEditor = await RoleService.getRoleByName("editor");
        const roleAdmin = await RoleService.getRoleByName("admin");
        const user = await userModel.findAll({
            where: {
                [Op.or]: [
                    { role_id: roleEditor.id },
                    { role_id: roleAdmin.id }
                ]
            }
        });

        return user;
    } catch(e) {
        throw new Error(e);
    }
}

const UserService = {
    getUserToApprove,
    approvalUsers,
    getUserByPk,
    getUserEditor
}

export default UserService;