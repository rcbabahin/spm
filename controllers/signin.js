export const handleSignin = (db, bcrypt) => (req, res) => {
    const { name, password } = req.body;

    if (!name || !password)
        return res.status(400).json('Incorrect form submition');
    
    db.select('name', 'hash').from('login')
    .where('name', '=', name)
    .then(data => {
        const isValid = bcrypt.compareSync(password , data[0].hash);

        if (isValid) {
            return db.select('*').from('users')
            .where('name', '=', name)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('Unable to get User'));
        } else {
            res.status(400).json('Wrong credentials');
        }
    })
    .catch(err => res.status(400).json('Wrong credentials'));
}