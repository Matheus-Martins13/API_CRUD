const Person = require('../models/Person');

exports.create = async (req, res) => {
    const register = new Person(req.body);
    try {
        const registerStatus = await register.register('create');
        res.status(registerStatus.status).json({ message: registerStatus.message })

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

exports.read =  async (req, res) => {
    try {
        const people = await Person.findPeople();
        res.status(200).json(people);
    } catch(err) {
        res.status(500).json({ error: err });
    }
}

exports.readById = async (req, res) => {
    try {
        const person = await Person.findPerson(req.params.id);

        if(person.status === 404) {
            res.status(person.status).json(person);
            return;
        }

        res.status(200).json(person);
        
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

exports.update = async (req, res) => {
    const id = req.params.id;
    const update = new Person(req.body);

    try {
        const updateStatus = await update.register('update', id);
        res.status(updateStatus.status).json({ message: updateStatus.message })

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

exports.delete = async (req, res) => {
    try {
        const person = await Person.findPerson(req.params.id);

        if(person.status === 404) {
            res.status(person.status).json(person);
            return;
        }

        await Person.deletePerson(req.params.id);
        
        res.status(200).json({ message: 'Usuário removido com sucesso.' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}
