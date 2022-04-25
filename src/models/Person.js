const mongoose = require('mongoose');

const PersonSchema = {
    name: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    approved: {
        type: Boolean,
        required: true,
    },
};

const PersonModel = mongoose.model('Person', PersonSchema);

class Person {
    constructor(body) {
        this.body = body;
        this.person = null;
        this.valid = null;
    }

    async register(origin, id) {
        const { name, salary, approved } = this.body;

        const validateLog = this.validate(name, salary, approved, origin);

        if (validateLog.status === 422) {
            return validateLog;
        }

        const person = this.createPerson(name, salary, approved);

        if (origin === 'update') {
            this.person = await PersonModel.updateOne({ _id: id }, person);
            if (this.person.matchedCount === 0) {
                return {
                    status: 404,
                    message: 'O usuário não foi encontrado.',
                }
            }
            return validateLog;
        }

        this.person = await PersonModel.create(person);
        return validateLog;
    }

    validate(name, salary, approved, origin) {
        if (!name || !salary || !approved) {
            return {
                status: 422,
                message: 'Dados inconsistentes',
            };
        }

        const msgAndStatus = this.checkOrigin(origin);

        if (!msgAndStatus) {
            return {
                status: 500,
                message: 'Algo deu errado.'
            }
        }

        return {
            status: msgAndStatus[1],
            message: `Pessoa ${msgAndStatus[0]} com sucesso.`,
        };
    }

    checkOrigin(origin) {
        let msg = null;
        let status = null;

        if (origin === 'create') {
            msg = 'inserida no sistema';
            status = 201
        } else if (origin === 'update') {
            msg = 'atualizada';
            status = 200;
        } else {
            return false;
        }

        return [msg, status];
    }

    createPerson(name, salary, approved) {
        const person = {
            name,
            salary,
            approved,
        };
        return person;
    }

    static async findPeople() {
        const people = await PersonModel.find();
        return people;
    }

    static async findPerson(id) {
        try {
            const person = await PersonModel.findOne({ _id: id });
            return person;
        } catch (err) {
            console.log(err);
            return {
                status: 404,
                message: 'O usuário não foi encontrado.',
            }
        }
    }

    static async deletePerson(id) {
        await PersonModel.deleteOne({ _id: id })
    }
}

module.exports = Person;
