const User = require('../models/user')
const mongo = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require('../properties')
const {projectRoot} = require('../properties')
const Pet = require('../models/pet')
const Appointment = require('../models/appointment')
const Admin = require('../models/administrator')


const generateAccessToken = (id, username, email, role) => {
    const payload = {
        id,
        username,
        email,
        role
    }
    return jwt.sign(payload, secret, {expiresIn: 60*60*24})
}

class ClientController{

    async signup(req, res){
        try{
            const {username, email, password} = req.body;
            const candidate = await User.findOne({email})
            if (candidate){
                return res.status(400).json({message: "Пользователь с таким логином уже существует"})
            }
            const hashedPassword = bcrypt.hashSync(password, 6);
            const user = new User({username, email, password: hashedPassword, role: "user"})
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
            const user = await User.findOne({email})
            if (!user){
                return res.status(400).json({message: `Пользователь ${email} не найден.`});
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword){
                return res.status(400).json({message: "Введен неверный пароль."});
            }
            const token = generateAccessToken(user._id, user.username, user.email, user.role);
            if(user.role === 'user'){
                return res.json({token, redirect: "clientPage/" + user._id})
            }else {
                return res.json({token, redirect: "adminPage/" + user._id})
            }

        } catch (e){
            console.log(e);
            res.status(400).json({message: "Ошибка входа в систему."})
        }
    }

    async renderClientPage(req, res){
        let user = jwt.decode(req.cookies.token)
        let pets1 = await Pet.find({owner: user.id})
        res.render("clientPage", {pets: pets1})
    }



    async addPet(req, res){
        try{
            const {token} = req.cookies
            let user = jwt.decode(token)
            let candidatePet = await Pet.findOne({owner: user.id, name: req.body.pet_name})
            if(candidatePet){
                return res.status(400).json({message: "У вас уже есть питомец с таким именем."})
            }

            let imageExtOffset = req.files.pet_pic.name.search("[.][a-zA-Z0-9]+$")
            let imgExt = req.files.pet_pic.name.substring(imageExtOffset, req.files.pet_pic.name.length)
            let imageName = user.id + "_" + req.body.pet_name + imgExt
            await req.files.pet_pic.mv(projectRoot + "/client/images/user_images/" + imageName);
            let petName = req.body.pet_name;
            let animalType = req.body.animal_type;
            let petAge = req.body.pet_age;
            let petSex = req.body.pet_sex;

            const pet = new Pet({
                owner: user.id,
                name: petName,
                type: animalType,
                age: petAge,
                sex: petSex,
                image: imageName});
            await pet.save();
            return res.json({message: "Книга успешно создана."})
        } catch (e) {
            res.status(400).json({message: "Ошибка создания книги."})
        }
    }

    async makeAppointment(req, res){
        try{
            const {token} = req.cookies
            let user = jwt.decode(token)
            let candidatePet = await Pet.findOne({owner: user.id, name: req.body.pet_name})
            if(!candidatePet){
                return res.status(400).json({message: "Мы потеряли вашего питомца."})
            }

            const appointment = new Appointment({
                client: user.id,
                pet: candidatePet._id,
                procedure: req.body.procedure,
                date: req.body.date,
                time: req.body.time,
                status: 'scheduled'
            });
            await appointment.save();
            return res.json({message: "Удачно записались."})
        } catch (e) {
            res.status(400).json({message: "Ошибка создания книги."})
        }
    }

    async logout(req, res){
        res.clearCookie('token');
        return res.json({message: "Удачно вышли."})
    }


}

module.exports = new ClientController();
