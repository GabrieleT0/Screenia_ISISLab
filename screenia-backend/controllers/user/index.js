import MailService from "../../services/mail";
import UserService from "../../services/user";

const getAllUsersToApprove = async (req, res) => {
    try {
        const users = await UserService.getUserToApprove();

        return res.status(200).send(users);
    } catch(e) {
        return res.status(500).send({ message: e.message });
    }
}

const getAllUserEditor = async (req, res) => {
    try {
        const editors = await UserService.getUserEditor();
        const editorsFilter = editors.map(({ name, surname, id, email }) => ({ name, surname, id, email }));

        return res.status(200).send(editorsFilter);
    } catch(e) {
        return res.status(500).send({ message: e.message });
    }
}

const approveUsers = async (req, res) => {
    const idUsers = req.body.idUsers;

    if(!idUsers) {
        return res.status(400).send("Param idUsers is required!");
    }

    if(!Array.isArray(idUsers) || !idUsers.every((id) => Number.isInteger(id))) {
        return res.status(400).send("Param idUsers must be an array of integers");
    }

    try {
        const updateUsers = await UserService.approvalUsers(idUsers);

        if(updateUsers[0] === 0) {
            return res.status(404).send("Users not found or accounts already approved!")
        }

        //Send mail to user approved
        for(const idUser of idUsers) {
            const user = await UserService.getUserByPk(idUser);
            MailService.sendMailApprovedAccount(user.email, user.name);
        }

        return res.status(200).send();
    } catch(e) {
        return res.status(500).send({ message: e.message });
    }
}

export {
    getAllUsersToApprove,
    getAllUserEditor,
    approveUsers
};
