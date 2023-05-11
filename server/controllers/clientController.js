const Client = require('../models/client')
const mongo = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('D:\\Developments\\VetClinic\\server\\config.properties');

const generateAccessToken = (id, username, email) => {
    const payload = {
        id,
        username,
        email
    }
    return jwt.sign(payload, properties.get("secret"), {expiresIn: "1w"})
}

class  ClientController{

    async signup(req, res){
        try{
            const {username, email, password} = req.body;
            const candidate = await Client.findOne({email})
            if (candidate){
                return res.status(400).json({message: "Пользователь с таким логином уже существует"})
            }
            const hashedPassword = bcrypt.hashSync(password, 6);
            const user = new Client({username, email, password: hashedPassword})
            await user.save()
            return res.json({message: "Пользователь успешно зарегестрирован."})
        } catch (e){
            console.log(e);
            res.status(400).json({message: "Ошибка регистрации."})
        }
    }

    async login(req, res){
        try{
            const {email, password} = req.body;
            const client = await Client.findOne({email})
            if (!client){
                return res.status(400).json({message: `Пользователь ${username} не найден.`});
            }
            const validPassword = bcrypt.compareSync(password, client.password);
            if (!validPassword){
                return res.status(400).json({message: "Введен неверный пароль."});
            }
            const token = generateAccessToken(client._id, client.username, client.email);
            return res.json({token})
        } catch (e){
            console.log(e);
            res.status(400).json({message: "Ошибка входа в систему."})
        }
    }


}

module.exports = new ClientController();
