import { role as roleModel } from "../../models";

const getRoleByName = async (name = "") => {
    return await roleModel.findOne({ where: { name }});
}

const RoleService = {
    getRoleByName
}

export default RoleService;