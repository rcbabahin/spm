export const handleSignup = (db, bcrypt) => (req, res) => {
    const { name, password } = req.body;

    if (!name || !password)
        return res.status(400).json('Incorrect form submition');
    
        const hash = bcrypt.hashSync(password, 8);
        
        db.transaction(trx => {
            trx.insert({
                hash,
                name
            })
            .into('login')
            .returning('name')
            .then(loginName => {
                return trx('users').returning('*')
                .insert({
                    name: loginName[0].name,
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to signup'))
}
