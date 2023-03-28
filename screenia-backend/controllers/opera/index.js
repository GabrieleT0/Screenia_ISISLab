import { extractArchive } from "../../utils"
import { storeArchiveOpera } from "../../utils/archive_opere/saveOpera";
const path = require('path');
const appRoot = require('app-root-path');
const fs = require('fs');
const express = require('express');
import OperaService from "../../services/opera";
import { Op } from "sequelize";

const getOperaById = async (req, res) => {
    const id = req.params.id;

    if(!id) {
        return res.status(400).send({ message:"Param id is required!" });
    }

    try {
        const result = await OperaService.getOperaById(id);

        if(!result) {
            return res.status(202).send();
        }

        return res.send(result);
    } catch(e) {
        return res.status(500).send({ message: e.message });
    }
}

const getAllOpera = async (req, res) => {
    const { page = 0, forPage = 0, searchTitle = "" } = req.query;
    const offset = (page - 1) * forPage;

    if(page === 0) {
        res.status(400).json({ message: "The page parameter must be greater than 0" });
    }

    const filters = {
        title: {
            [Op.like]: `%${searchTitle}%`
        }
    }

    try {
        const opere = await OperaService.getAllOperaByFilter(offset, forPage, filters);

        res.status(200).send({
            data: [...opere],
            total: opere.length
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const saveAllOpera = async (req, res) => {
    const { file } = req.files;

    if(!file) {
        return res.status(400).send("Param file is required!");
    }

    try {
        const extension = (path.extname(file.name)).toLowerCase();

        if(extension !== ".zip") {
            return res.status(404).send({ message: "The extension file is not supported!" });
        }

        let tempFilePath = file.tempFilePath;

        const tempFolderPath = path.join(`${appRoot}`, 'tmp');
    
        await extractArchive('tmp', tempFilePath);

        const deleteTempDirectory = () => (fs.rmSync(tempFolderPath, { recursive: true }));

        storeArchiveOpera(`${tempFolderPath}/${path.parse(file.name).name}`, deleteTempDirectory)

        return res.status(200).send();
    } catch(e) {
        return res.status(500).send({ message: e.message });
    }
}

export {
    getAllOpera,
    getOperaById,
    saveAllOpera
}